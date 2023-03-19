import type {
    Node,
    Project as TSProject,
    Symbol as TSSymbol,
    Type as TSType,
    ProjectOptions,
} from 'ts-morph';

import * as path from 'path';

export function getType(symbol?: TSSymbol): TSType {
    return symbol?.getTypeAtLocation(symbol.getDeclarations()[0]) as TSType;
}

export class DynamicType {
    value: any;
    type: TSType;

    constructor({value, type}: {value: any; type: TSType}) {
        this.value = value;
        this.type = type;
    }
}

export class UnionType extends Array {}

function isRecord(type: TSType) {
    return type?.getAliasSymbol()?.getEscapedName() === 'Record';
}

export const STATIC_KEY = Symbol('__TADDY_STATIC_KEY__');

export function isStaticValue(value) {
    if (!value || typeof value !== 'object') {
        return true;
    }

    if (value instanceof UnionType) {
        return false;
    }

    return value[STATIC_KEY] || false;
}

function filterValue(value: unknown): boolean {
    // filter vendor prefixes
    return String(value).startsWith('-');
}

export function parseValue(type: TSType): ReturnType<typeof JSON.parse> {
    if (!type) return null;

    if (type.isAny() || type.isUnknown()) {
        return new DynamicType({value: null, type});
    }

    if (isRecord(type)) {
        return parseRecord(type);
    }

    if (type.isArray()) {
        return parseArray(type);
    }

    if (type.isUnion()) {
        return new UnionType(...type.getUnionTypes().map(parseValue));
    }

    if (type.isObject()) {
        return parseObject(type);
    }

    let value = type?.getText();

    /**
     * Firstly, exclude types like "string & {}"
     *
     * TODO: think about other intersection types
     */
    if (!value || value?.includes('&')) {
        return null;
    }

    try {
        value = JSON.parse(value);
    } catch (e) {
        return new DynamicType({value, type});
    }

    if (filterValue(value)) return null;

    return value;
}

function parseMixinParameters(
    params?: TSSymbol,
): ReturnType<typeof parseValue> {
    const type = getType(params);

    return parseValue(type);
}

type MixinValue = ReturnType<typeof parseMixinParameters>;

function parseMixin(mixin?: TSSymbol): MixinValue | MixinValue[] {
    const type = getType(mixin);

    if (type?.getCallSignatures().length === 0) {
        return parseMixinParameters(mixin);
    }

    return type
        ?.getCallSignatures()[0]
        .getParameters()
        .map(parseMixinParameters);
}

function parseRecord(type: TSType) {
    const [k, v] = type.getAliasTypeArguments();
    const key = parseValue(k);
    const value = parseValue(v);
    if (!Array.isArray(key)) {
        return {[key]: value, [STATIC_KEY]: value[STATIC_KEY]};
    }

    return key.map((prop) => ({
        [prop]: value,
        [STATIC_KEY]: value[STATIC_KEY],
    }));
}

// TODO: improve the array parsing (such as not just union types)
function parseArray(type: TSType) {
    const elements: any = [];
    elements[STATIC_KEY] = true;

    function applyElement(element: TSType) {
        const value = parseValue(element);
        if (!value) return;

        const isStatic = isStaticValue(value);

        elements[STATIC_KEY] = elements[STATIC_KEY] && isStatic;

        elements.push(
            isStatic ? value : new Set([].concat(value).filter(Boolean)),
        );
    }

    const elementType = type.getArrayElementTypeOrThrow();

    for (const element of elementType.getUnionTypes() || [elementType]) {
        applyElement(element);
    }

    return elements;
}

export function parseObject(type?: TSType): {
    [key: string]: Set<ReturnType<typeof parseValue>>;
} {
    const props = {};
    let isStaticObject = true;

    for (const propSymbol of type?.getProperties() ?? []) {
        const name = propSymbol.getEscapedName();

        const value = parseMixin(propSymbol);

        if (!value) continue;

        const isStatic = isStaticValue(value);

        isStaticObject = isStaticObject && isStatic;

        props[name] = isStatic
            ? value
            : new Set([].concat(value).filter(Boolean));
    }

    props[STATIC_KEY] = isStaticObject;

    return props;
}

export type TSProcessorOptions = ProjectOptions;

export class TSProcessor {
    project: TSProject;

    constructor(config: TSProcessorOptions | TSProject) {
        // lazy require for ts-morph
        const {Project}: {Project: typeof TSProject} = require('ts-morph');

        if (config instanceof Project) {
            this.project = config;
            return;
        }

        this.project = new Project({
            tsConfigFilePath: path.join(process.cwd(), 'tsconfig.json'),
            ...config,
        });
    }

    getTypeAtPos(
        filename: string,
        code: string,
        start: number,
        end: number,
    ): Node | void {
        let sourceFile = this.project.getSourceFile(filename);

        if (sourceFile && sourceFile.getFullText() !== code) {
            sourceFile.replaceText([0, sourceFile.getEnd()], code);
        } else {
            sourceFile = this.project.createSourceFile(filename, code, {
                overwrite: true,
            });
        }

        const typeNode = sourceFile.getDescendantAtStartWithWidth(
            start,
            end - start,
        );

        return typeNode;
    }
}
