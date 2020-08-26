import * as t from '@babel/types';
import type {NodePath, PluginPass, ConfigAPI} from '@babel/core';

import assert from 'assert';

import {isTaddyEvaluation} from './helpers';
import {taggedTemplateToObject} from './helpers/taggedTemplateToObject';
import {MACRO_NAME, PACKAGE_NAME} from './config';

import type {OutputOptions} from './handlers';
import {createProcessors, output, getEnv} from './handlers';

import type {ProcessorConfig} from './Processor';

type CompileOptions = {
    /**
     * Apply static evaluation optimizations
     *
     * @default true
     */
    evaluate: ProcessorConfig['evaluate'];

    /**
     * Use typescript language server
     *
     * By default, true for typescript files
     * @default false
     */
    unstable_typescript: ProcessorConfig['typescript'];

    /**
     * Use CSS Variables fallback
     * If true, then even not optimized dynamic values would be optimized as possible
     *
     * @default true
     */
    unstable_CSSVariableFallback: ProcessorConfig['CSSVariableFallback'];

    /**
     * Based on static analysis remove unused bindings after compilation
     *
     * @default true
     */
    unstable_optimizeBindings: ProcessorConfig['optimizeBindings'];

    /**
     * Support tagged template literals.
     *
     * That's an experimental option that might be deprecated.
     *
     * @default false;
     */
    unstable_useTaggedTemplateLiterals: boolean;
};

export type MacroConfig = Partial<{
    env?: ReturnType<typeof getEnv>;
    compileOptions: Partial<CompileOptions>;
    outputOptions: Partial<OutputOptions>;
}>;

export type MacroOptions = {
    state: PluginPass;
    babel: ConfigAPI;
    config?: MacroConfig;
    references: Record<string, NodePath[]>;
};

function mapCompileOptions({
    evaluate = true,
    unstable_typescript = false,
    unstable_CSSVariableFallback = true,
    unstable_optimizeBindings = true,
    unstable_useTaggedTemplateLiterals = false,
}: Partial<CompileOptions> & {filename: string}): ProcessorConfig & {
    useTaggedTemplateLiterals: boolean;
} {
    return {
        evaluate,
        typescript: unstable_typescript,
        CSSVariableFallback: unstable_CSSVariableFallback,
        optimizeBindings: unstable_optimizeBindings,

        useTaggedTemplateLiterals: unstable_useTaggedTemplateLiterals,
    };
}

export function macro({
    references,
    babel,
    state,
    config: _config = {},
}: MacroOptions) {
    const {env = getEnv(babel), ...config} = _config;

    if (isTaddyEvaluation(state)) {
        return;
    }

    const program = state.file.path as NodePath<t.Program>;
    const code = state.file.code;
    const {filename} = state;

    let importPath: NodePath<t.ImportDeclaration> | null = null;

    program.traverse({
        ImportDeclaration(p) {
            const {node} = p;
            if (
                !(
                    node.source.value === PACKAGE_NAME ||
                    node.source.value === MACRO_NAME
                )
            ) {
                return;
            }

            importPath = p;

            importPath.node.source = t.stringLiteral('taddy');

            p.stop();
        },
    });

    const importCache = new Map<string, t.ImportSpecifier>();

    const {useTaggedTemplateLiterals, ...compileOptions} = mapCompileOptions({
        filename,
        ...config.compileOptions,
    });

    const {handlers, finish} = createProcessors(compileOptions, {
        env,
        filename,
        code,
        addImport(name: string): t.ImportSpecifier['local'] {
            if (!importCache.has(name)) {
                const specifier = t.importSpecifier(
                    t.identifier(`_${name}_`),
                    t.identifier(name),
                );
                importCache.set(name, specifier);

                assert(importPath, 'There is no taddy imports');

                importPath.node.specifiers.push(specifier);
            }

            return importCache.get(name)!.local;
        },
    });

    for (const key in references) {
        if (!(key in handlers)) continue;

        for (let ref of references[key]) {
            let currentPath = ref.parentPath;
            let currentKey = key;

            if (
                key === 'css' &&
                currentPath.isMemberExpression() &&
                'name' in currentPath.node.property &&
                currentPath.node.property.name === 'mixin'
            ) {
                currentPath = currentPath.parentPath;
                currentKey = 'mixin';
            }

            if (
                useTaggedTemplateLiterals &&
                (currentKey === 'css' || currentKey === 'mixin') &&
                currentPath.isTaggedTemplateExpression()
            ) {
                const obj = taggedTemplateToObject(currentPath);
                currentPath.replaceWith(
                    t.callExpression(currentPath.node.tag, [obj]),
                );
            }

            handlers[currentKey](currentPath);
        }
    }

    const {isStatic} = finish();

    if (isStatic && importPath !== null) {
        importPath!.node.source = t.stringLiteral('@taddy/core');
    }

    output({
        env,
        state,
        config: config.outputOptions,
    });

    return {
        keepImports: true,
    };
}
