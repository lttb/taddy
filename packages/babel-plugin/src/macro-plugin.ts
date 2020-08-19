import * as t from '@babel/types';
import type {NodePath, PluginPass, ConfigAPI} from '@babel/core';

import {isTaddyEvaluation} from './helpers';
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
};

export type MacroConfig = Partial<{
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
    code,
    evaluate = true,
    typescript = /\.tsx?$/.test(filename),
    unstable_CSSVariableFallback = true,
}: Partial<CompileOptions> &
    Pick<ProcessorConfig, 'code' | 'filename'>): ProcessorConfig {
    return {
        filename,
        code,
        evaluate,
        typescript,
        CSSVariableFallback: unstable_CSSVariableFallback,
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

    const {handlers, finish} = createProcessors(
        mapCompileOptions({...config.compileOptions, filename, code}),
        {env},
    );

    for (const key in references) {
        if (!handlers[key]) continue;

        references[key].forEach((path) => handlers[key](path.parentPath));
    }

    let importPath;

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

    const {isStatic} = finish();

    if (isStatic && importPath) {
        importPath.node.source = t.stringLiteral('@taddy/core');
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
