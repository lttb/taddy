import * as t from '@babel/types';
import type {PluginPass} from '@babel/core';
import type {NodePath} from '@babel/traverse';
import {SourceMapGenerator} from 'source-map';

import {VARS_KEY, config} from '@taddy/core';
import {$css} from 'taddy';

import type {Env} from './types';

import {evaluate} from './helpers/evaluate';
import {getObjectPropertyKey} from './helpers/getObjectPropertyKey';
import {optimizeStaticStyles} from './helpers/optimizeStaticStyles';
import {
    mergeObjectProperties,
    mergeObjects,
} from './helpers/mergeObjectProperties';

import TSProcessor, {
    parseValue,
    isStaticValue,
    DynamicType,
    STATIC_KEY,
    type TSProcessorOptions,
} from './TSProcessor';

type ObjectProperties = t.ObjectExpression['properties'];

type ArrayElements = t.ArrayExpression['elements'];

export type ProcessorConfig = {
    typescript?: boolean | TSProcessorOptions;
    evaluate?: boolean;
    CSSVariableFallback?: boolean;
    optimizeBindings?: boolean;
};

export type ProcessOptions = {
    env: Env;
    mixin: boolean;
    filename: string;
    code: string;
    addImport(name: string): t.ImportSpecifier['local'];
    sourceMap?: string;
    state?: PluginPass;
    sourceMapGenerator?: SourceMapGenerator;
};

type CommonOptions = {
    postfix?: string;
};

type ObjectOptions = CommonOptions & {
    properties: ObjectProperties;
};

function isUndefined(path: NodePath<any>) {
    return path.isIdentifier() && path.node.name === 'undefined';
}

function getLiteralValue(path: NodePath<any>): any {
    try {
        // eslint-disable-next-line no-eval
        return eval(path.toString());
    } catch (error) {
        return getLiteralValue.FAIL;
    }
}
getLiteralValue.FAIL = Symbol('FAILED_VALUE');

function getHashedName(key: string, {postfix}: CommonOptions): string {
    return config.nameGenerator.getName(key, '', {postfix}).join('');
}

const isCSSProperty = (key) => {
    return key.slice(0, 2) === '--' || /[\w-]/.test(key);
};

// TODO: bottom up and split the initialization
let cachedTSProject;

export class Processor {
    config: ProcessorConfig;

    options!: ProcessOptions;
    isStatic!: boolean;
    classNameNodes!: WeakSet<t.ObjectProperty>;
    optimizationPaths!: Set<NodePath<any>>;
    variables!: t.ObjectProperty[];

    private prepare(options: ProcessOptions) {
        this.options = options;
        this.variables = [];
        this.classNameNodes = new WeakSet();
        this.optimizationPaths = new Set();
    }

    constructor({config}: {config: ProcessorConfig}) {
        this.config = config;
    }

    get tsProject(): TSProcessor {
        if (!this.config.typescript) {
            throw new Error(
                'TADDY: cant use typescript without enabled option',
            );
        }

        return (
            cachedTSProject ||
            (cachedTSProject = new TSProcessor(
                this.config.typescript === true ? {} : this.config.typescript,
            ))
        );
    }

    $css(rule, options?: any) {
        // console.log('sm', this.options.sourceMap)
        return $css(rule, {
            ...options,
            // hash: stringHash(this.options.filename),
        });
    }

    isClassNameNode(node) {
        return this.classNameNodes.has(node);
    }

    classNamesToNode(classNames: object) {
        const properties: t.ObjectProperty[] = [];

        for (const key in classNames) {
            const classValue = classNames[key];

            const propName = t.identifier(key);

            let propValue;
            if (typeof classNames[key] === 'object') {
                propValue = t.objectExpression(
                    this.classNamesToNode(classNames[key]),
                );
            } else if (typeof classNames[key] === 'boolean') {
                propValue = t.booleanLiteral(classValue);
            } else {
                propValue = t.stringLiteral(String(classValue));
            }

            const node = t.objectProperty(propName, propValue);

            this.classNameNodes.add(node);

            properties.push(node);
        }

        return properties;
    }

    stylesToNode(key: string, value: unknown, {postfix = ''} = {}) {
        const {className} = this.$css({[key]: value}, {postfix});
        return this.classNamesToNode(className);
    }

    processPropertyValue(
        key: string,
        path: NodePath<t.ObjectProperty>,
        {postfix, properties}: ObjectOptions,
    ) {
        const keyPath = path.get('key');
        const valuePath = path.get('value') as NodePath<any>;

        const tryLiteralValue = (): boolean => {
            if (!(valuePath.isLiteral() || isUndefined(valuePath)))
                return false;

            const value = getLiteralValue(valuePath);

            if (value === getLiteralValue.FAIL) {
                return false;
            }

            properties.push(...this.stylesToNode(key, value, {postfix}));

            return true;
        };

        const tryObjectExpressionValue = (): boolean => {
            if (!valuePath.isObjectExpression()) return false;

            this.process(valuePath, {
                postfix: postfix + key,
            });

            let currentStyles: ObjectProperties = [];

            for (const nestedProp of valuePath.node.properties) {
                if (this.isClassNameNode(nestedProp)) {
                    if (currentStyles.length) {
                        properties.push(
                            t.objectProperty(
                                keyPath.node,
                                t.objectExpression(currentStyles),
                            ),
                        );
                        currentStyles = [];
                    }

                    properties.push(nestedProp);
                } else {
                    currentStyles.push(nestedProp);
                }
            }

            if (currentStyles.length) {
                properties.push(
                    t.objectProperty(
                        keyPath.node,
                        t.objectExpression(currentStyles),
                    ),
                );
            }

            return true;
        };

        const tryComposesValue = (): boolean => {
            if (!(key === 'composes' && valuePath.isArrayExpression())) {
                return false;
            }

            if (postfix !== '') {
                throw new Error(
                    'TADDY: composes could be used only on top level',
                );
            }

            for (const elemPath of valuePath.get('elements')) {
                this.process(elemPath);
            }

            return false;
        };

        const tryEvaluateValue = (): boolean => {
            if (!this.config.evaluate) return false;

            const {value, error} = evaluate(valuePath);

            if (error) return false;

            properties.push(...this.stylesToNode(key, value, {postfix}));

            this.optimizationPaths.add(path);

            return true;
        };

        const STOP = Symbol('STOP');

        const getTSValue = (tsValuePath: NodePath<any>) => {
            const tsType = this.tsProject?.getTypeAtPos(
                this.options.filename,
                this.options.code,
                tsValuePath.node.start || 0,
                tsValuePath.node.end || 0,
            );

            if (!tsType) return STOP;

            return parseValue(tsType.getType());
        };

        const getComposesTSValue = (path: NodePath<t.ArrayExpression>) => {
            const elements: any[] = [];
            elements[STATIC_KEY] = true;
            for (const elementPath of path.get('elements')) {
                if (!elementPath) return;
                const value = getTSValue(elementPath);

                if (value === STOP) return;

                elements[STATIC_KEY] =
                    elements[STATIC_KEY] && isStaticValue(value);

                elements.push(value);
            }
            return elements;
        };

        const tryTypescriptValue = (): boolean => {
            if (!this.config.typescript) return false;

            let tsValue;

            if (key === 'composes' && valuePath.isArrayExpression()) {
                tsValue = getComposesTSValue(valuePath);
            } else {
                tsValue = getTSValue(valuePath);
            }

            if (tsValue === STOP) return false;

            if (isStaticValue(tsValue)) {
                properties.push(...this.stylesToNode(key, tsValue, {postfix}));

                this.optimizationPaths.add(path);

                return true;
            }

            // TODO: improve composes handling
            if (key === 'composes') return false;

            const variants = [].concat(tsValue);

            let isCompilable = true;

            // pre-generate classes for variants
            variants.forEach((v: any) => {
                if (v instanceof DynamicType || !isStaticValue(v)) {
                    isCompilable = false;
                    return;
                }

                this.$css({[key]: v}, {postfix});
            });

            if (!isCompilable) return false;

            const propKey = getHashedName(key, {postfix});

            const hashFunctionNode = this.options.addImport('h');

            properties.push(
                t.objectProperty(
                    t.identifier(propKey),
                    t.callExpression(hashFunctionNode, [
                        valuePath.node as t.Expression,
                    ]),
                ),
            );

            return true;
        };

        const tryCSSVariableValue = (): boolean => {
            if (!this.config.CSSVariableFallback) return false;

            // think about dynamic nested for mixins
            // in case of nested dynamic values in mixin we can't fallback them as custom properties
            if (
                this.options.mixin ||
                key === 'composes' ||
                !isCSSProperty(key)
            ) {
                return false;
            }

            const value = getHashedName(key, {postfix});

            const dynamicValue = `--${value}`;

            this.variables.push(
                t.objectProperty(t.stringLiteral(dynamicValue), valuePath.node),
            );

            properties.push(
                ...this.stylesToNode(key, `var(${dynamicValue})`, {postfix}),
            );

            return true;
        };

        if (
            tryLiteralValue() ||
            tryObjectExpressionValue() ||
            tryComposesValue() ||
            tryEvaluateValue() ||
            tryTypescriptValue() ||
            tryCSSVariableValue()
        ) {
            return;
        }

        properties.push(path.node);
    }

    processObjectProperty(
        path: NodePath<t.ObjectProperty>,
        {postfix = '', properties}: ObjectOptions,
    ) {
        const keyPath = path.get('key');
        const key = getObjectPropertyKey(keyPath);

        const tryEvaluateKey = (): boolean => {
            if (!this.config.evaluate) return false;

            const {value, error} = evaluate(keyPath);

            if (error) return false;

            keyPath.replaceWith(t.stringLiteral(value));

            this.processPropertyValue(value, path, {
                postfix,
                properties,
            });

            return true;
        };

        if (key === 'className' || key === 'style' || key === null) {
            if (tryEvaluateKey()) {
                return;
            }

            properties.push(path.node);
            return;
        }

        this.processPropertyValue(key, path, {postfix, properties});
    }

    processSpreadElement(
        path: NodePath<t.SpreadElement>,
        {postfix = '', properties}: ObjectOptions,
    ) {
        const tryEvaluateSpreadElement = (): boolean => {
            if (!this.config.evaluate) return false;

            const {value} = evaluate(path.get('argument'));
            if (!value) return false;

            const {className} = this.$css(value, {postfix});

            properties.push(...this.classNamesToNode(className));

            this.optimizationPaths.add(path);

            return true;
        };

        const tryTypescriptSpreadElement = (): boolean => {
            if (!this.config.typescript) return false;

            const {argument} = path.node;

            const tsType = this.tsProject?.getTypeAtPos(
                this.options.filename,
                this.options.code,
                argument.start || 0,
                argument.end || 0,
            );
            if (!tsType) return false;

            const styles = parseValue(tsType.getType());

            if (!isStaticValue(styles)) return false;

            const {className} = this.$css(styles, {postfix});
            properties.push(...this.classNamesToNode(className));

            this.optimizationPaths.add(path);

            return true;
        };

        if (tryEvaluateSpreadElement() || tryTypescriptSpreadElement()) {
            return;
        }

        this.process(path.get('argument'));

        properties.push(path.node);
    }

    processLogicalExpression(
        path: NodePath<t.LogicalExpression>,
        options: CommonOptions,
    ) {
        this.process(path.get('left'), options);
        this.process(path.get('right'), options);
    }

    processObjectExpression(
        path: NodePath<t.ObjectExpression>,
        {postfix = ''}: CommonOptions,
    ) {
        const properties: ObjectProperties = [];

        for (const propPath of path.get('properties')) {
            if (propPath.isObjectProperty()) {
                this.processObjectProperty(propPath, {postfix, properties});

                continue;
            }

            if (propPath.isSpreadElement()) {
                this.processSpreadElement(propPath, {postfix, properties});

                continue;
            }

            properties.push(propPath.node);
        }

        /**
         * TODO: think about static optimizations for mixins
         */
        if (this.options.mixin) return;

        path.node.properties = mergeObjectProperties(properties);
    }

    processConditionalExpression(
        path: NodePath<t.ConditionalExpression>,
        options: CommonOptions = {},
    ) {
        this.process(path.get('consequent'), options);
        this.process(path.get('alternate'), options);
    }

    process(path: NodePath<any>, options: CommonOptions = {}) {
        if (path.isLogicalExpression()) {
            this.processLogicalExpression(path, options);
        } else if (path.isObjectExpression()) {
            this.processObjectExpression(path, options);
        } else if (path.isConditionalExpression()) {
            this.processConditionalExpression(path, options);
        }
    }

    run(callPath: NodePath<t.CallExpression>, options: ProcessOptions) {
        this.prepare(options);

        const tryEvaluate = (path): boolean => {
            if (!this.config.evaluate) return false;

            const {value, error} = evaluate(path);
            if (error) return false;

            const {className} = this.$css(value);

            /**
             * TODO: think about static optimizations for mixins
             */
            if (this.options.mixin) return true;

            const properties = this.classNamesToNode(className);

            path.replaceWith(
                t.objectExpression(mergeObjectProperties(properties)),
            );

            this.optimizationPaths.add(path);

            return true;
        };

        const args = ([] as NodePath<any>[]).concat(callPath.get('arguments'));

        let isObjectable = true;

        for (const arg of args) {
            if (tryEvaluate(arg)) {
                continue;
            }

            this.process(arg);

            if (!arg.isObjectExpression()) {
                isObjectable = false;
                continue;
            }
        }

        const nodes = args.map((x) => x.node);
        const argPath = args[0];

        if (this.variables.length > 0) {
            nodes.push(
                t.objectExpression([
                    t.objectProperty(
                        t.identifier(VARS_KEY),
                        t.objectExpression(this.variables),
                    ),
                ]),
            );
        }

        if (isObjectable) {
            argPath.replaceWith(
                t.objectExpression(mergeObjects(nodes as t.ObjectExpression[])),
            );

            callPath.node.arguments = [argPath.node];

            const path = argPath;

            const isStatic = path.node.properties.every((x) => {
                if (!t.isObjectProperty(x)) return false;
                if (!('name' in x.key)) return false;
                if (
                    !(
                        x.key.name[0] === '_' ||
                        x.key.name === 'className' ||
                        x.key.name === 'style' ||
                        x.key.name === VARS_KEY ||
                        t.isBooleanLiteral(x.value)
                    )
                ) {
                    return false;
                }

                return true;
            });

            if (!this.options.mixin && isStatic) {
                optimizeStaticStyles(path);
            }

            return {
                isStatic,
                optimizationPaths: this.optimizationPaths,
            };
        }

        return {
            isStatic: false,
            optimizationPaths: this.optimizationPaths,
        };
    }
}
