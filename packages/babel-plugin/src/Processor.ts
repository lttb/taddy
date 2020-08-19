import * as t from '@babel/types';
import type {NodePath} from '@babel/traverse';

import {VARS_KEY, config} from '@taddy/core';
import {$css} from 'taddy';

import {
    evaluate,
    getObjectPropertyKey,
    optimizeStaticStyles,
    mergeObjectProperties,
} from './helpers';

import TSProcessor, {
    parseValue,
    isStaticValue,
    DynamicType,
    STATIC_KEY,
} from './TSProcessor';

import type {TSProcessorOptions} from './TSProcessor';

type ObjectProperties = t.ObjectExpression['properties'];

export type ProcessorConfig = {
    typescript?: boolean | TSProcessorOptions;
    evaluate?: boolean;
    CSSVariableFallback?: boolean;
    code: string;
    filename: string;
};

type CommonOptions = {
    postfix?: string;
};

type ObjectOptions = CommonOptions & {
    properties: ObjectProperties;
};

function getLiteralValue(path: NodePath<t.Literal>): any {
    // eslint-disable-next-line no-eval
    return eval(path.toString());
}

function getHashedName(key: string, {postfix}: CommonOptions): string {
    return config.nameGenerator.getName(key, '', {postfix}).join('');
}

export class Processor {
    config: ProcessorConfig;
    tsProject?: TSProcessor;

    mixin!: boolean;
    isStatic!: boolean;
    classNameNodes!: WeakSet<t.ObjectProperty>;
    optimizationPaths!: Set<NodePath<any>>;
    variables!: t.ObjectProperty[];

    private prepare({mixin}: {mixin: boolean}) {
        this.mixin = mixin;
        this.isStatic = false;
        this.variables = [];
        this.classNameNodes = new WeakSet();
        this.optimizationPaths = new Set();
    }

    constructor({config}: {config: ProcessorConfig}) {
        this.config = config;

        if (config.typescript) {
            this.tsProject = new TSProcessor(
                config.typescript === true ? {} : config.typescript,
            );
        }
    }

    isClassNameNode(node) {
        return this.classNameNodes.has(node);
    }

    classNamesToNode(classNames: object) {
        const properties: t.ObjectProperty[] = [];

        for (const key in classNames) {
            const classValue = classNames[key];

            const propName = t.identifier(key);
            const propValue =
                typeof classNames[key] === 'boolean'
                    ? t.booleanLiteral(classValue)
                    : t.stringLiteral(String(classValue));

            const node = t.objectProperty(propName, propValue);

            this.classNameNodes.add(node);

            properties.push(node);
        }

        return properties;
    }

    stylesToNode(key: string, value: unknown, {postfix = ''} = {}) {
        const {className} = $css({[key]: value}, {postfix});
        return this.classNamesToNode(className);
    }

    processPropertyValue(
        key: string,
        path: NodePath<t.ObjectProperty>,
        {postfix, properties}: ObjectOptions,
    ) {
        const keyPath = path.get('key');
        const valuePath = path.get('value');

        const tryLiteralValue = (): boolean => {
            if (!valuePath.isLiteral()) return false;

            const value = getLiteralValue(valuePath);

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

        const tryEvaluateValue = (): boolean => {
            if (!this.config.evaluate) return false;

            const {value} = evaluate(valuePath);
            if (!value) return false;

            // console.log('evaluate', {value});

            properties.push(...this.stylesToNode(key, value, {postfix}));

            this.optimizationPaths.add(path);

            return true;
        };

        const STOP = Symbol('STOP');

        const getTSValue = (tsValuePath: NodePath<any>) => {
            const tsType = this.tsProject?.getTypeAtPos(
                this.config.filename,
                this.config.code,
                tsValuePath.node.start || 0,
                tsValuePath.node.end || 0,
            );

            if (!tsType) return;

            // console.log('TYPE', tsType.getType().getText());

            return parseValue(tsType.getType());
        };

        const getComposesTSValue = (path: NodePath<t.ArrayExpression>) => {
            const elements: any[] = [];
            elements[STATIC_KEY] = true;
            for (let elementPath of path.get('elements')) {
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

            if (!tsValue) return false;

            // console.log({tsValue});

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

                $css({[key]: v}, {postfix});
            });

            if (!isCompilable) return false;

            const propKey = getHashedName(key, {postfix});

            properties.push(
                t.objectProperty(
                    t.identifier(propKey),
                    t.callExpression(t.identifier('css.h'), [
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
                this.mixin ||
                key === 'composes' ||
                key[0] === ':' ||
                /[\W]/.test(key)
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

            const {value} = evaluate(keyPath);

            if (!value) return false;

            this.processPropertyValue(String(value), path, {
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

            const {className} = $css(value, {postfix});

            properties.push(...this.classNamesToNode(className));

            this.optimizationPaths.add(path);

            return true;
        };

        const tryTypescriptSpreadElement = (): boolean => {
            if (!this.config.typescript) return false;

            const {argument} = path.node;

            const tsType = this.tsProject?.getTypeAtPos(
                this.config.filename,
                this.config.code,
                argument.start || 0,
                argument.end || 0,
            );
            if (!tsType) return false;

            const styles = parseValue(tsType.getType());

            if (!isStaticValue(styles)) return false;

            const {className} = $css(styles, {postfix});
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

        path.node.properties = mergeObjectProperties(properties);
    }

    process(path: NodePath<any>, options: CommonOptions = {}) {
        if (path.isLogicalExpression()) {
            this.processLogicalExpression(path, options);
            return;
        }

        if (path.isObjectExpression()) {
            this.processObjectExpression(path, options);
            return;
        }
    }

    run(path: NodePath<t.ObjectExpression>, {mixin = false} = {}) {
        // supports only object expressions at the moment
        if (!path.isObjectExpression()) {
            return null;
        }

        this.prepare({mixin});

        this.process(path);

        if (this.variables.length > 0) {
            path.node.properties.push(
                t.objectProperty(
                    t.identifier(VARS_KEY),
                    t.objectExpression(this.variables),
                ),
            );
        }

        const isStatic =
            !this.mixin &&
            path.node.properties.every((x) => {
                if (!t.isObjectProperty(x)) return false;
                if (!('name' in x.key)) return false;
                if (
                    !(
                        x.key.name[0] === '_' ||
                        x.key.name === 'className' ||
                        x.key.name === 'style' ||
                        x.key.name === VARS_KEY
                    )
                ) {
                    return false;
                }

                return true;
            });

        if (isStatic) {
            optimizeStaticStyles(path);
        }

        return {
            isStatic,
            optimizationPaths: this.optimizationPaths,
        };
    }
}
