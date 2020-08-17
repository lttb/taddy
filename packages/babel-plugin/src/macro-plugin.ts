import * as t from '@babel/types';
import type {NodePath, PluginPass, ConfigAPI} from '@babel/core';

import {isTaddyEvaluation} from './helpers';
import {MACRO_NAME, PACKAGE_NAME} from './config';

import type {OutputOptions, Env} from './handlers';
import {createProcessors, output} from './handlers';

import type {ProcessorConfig} from './Processor';

type CompileOptions = {
    typescript: ProcessorConfig['typescript'];
    evaluate: ProcessorConfig['evaluate'];
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

export function macro({references, state, config: _config = {}}: MacroOptions) {
    const config: MacroConfig & {
        env: Env;
    } = {
        env: process.env.NODE_ENV as Env,
        ..._config,
    };

    if (isTaddyEvaluation(state)) {
        return;
    }

    const program = state.file.path as NodePath<t.Program>;
    const code = state.file.code;
    const {filename} = state;

    const {handlers, finish} = createProcessors({
        evaluate: true,
        typescript: /\.tsx?$/.test(filename),
        ...config.compileOptions,
        filename,
        code,
    });

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
        env: config.env,
        state,
        config: config.outputOptions,
    });

    return {
        keepImports: true,
    };
}
