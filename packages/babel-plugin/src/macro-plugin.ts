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
     * Use typescript language server
     *
     * By default, true for typescript files
     * @default true
     */
    typescript: ProcessorConfig['typescript'];

    /**
     * Apply static evaluation optimizations
     *
     * @default true
     */
    evaluate: ProcessorConfig['evaluate'];

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
     * @default true;
     */
    unstable_taggedTemplateLiterals: boolean;
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
    filename,
    evaluate = true,
    typescript = /\.tsx?$/.test(filename),
    unstable_CSSVariableFallback = true,
    unstable_optimizeBindings = true,
    unstable_taggedTemplateLiterals = true,
}: Partial<CompileOptions> & {filename: string}): ProcessorConfig & {
    taggedTemplateLiterals: boolean;
} {
    return {
        evaluate,
        typescript,
        CSSVariableFallback: unstable_CSSVariableFallback,
        optimizeBindings: unstable_optimizeBindings,

        taggedTemplateLiterals: unstable_taggedTemplateLiterals,
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

    const {taggedTemplateLiterals, ...compileOptions} = mapCompileOptions({
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
        if (!handlers[key]) continue;

        for (let path of references[key]) {
            const {parentPath} = path;

            if (
                taggedTemplateLiterals &&
                (key === 'css' || key === 'mixin') &&
                parentPath.isTaggedTemplateExpression()
            ) {
                const obj = taggedTemplateToObject(parentPath);
                parentPath.replaceWith(
                    t.callExpression(parentPath.node.tag, [obj]),
                );
            }

            handlers[key](parentPath);
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
