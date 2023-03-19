import * as t from '@babel/types';
import type {NodePath, PluginPass, ConfigAPI} from '@babel/core';

import assert from 'assert';
import resolve from 'resolve';
import path from 'path';

import {$css, config} from 'taddy';

import {MACRO_NAME, PACKAGE_NAME, getEnv} from './config';
import {isTaddyEvaluation} from './helpers/utils';
import {taggedTemplateToObject} from './helpers/taggedTemplateToObject';
import {createHandlers} from './handlers';

import {Output, type OutputOptions} from './Output';
import type {ProcessorConfig} from './Processor';

import {
    makeSourceMapGenerator,
    convertGeneratorToComment,
    type SourceMapGenerator,
} from './source-maps';
import type {Target} from './types';

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

    /**
     * Use sourcemaps
     *
     * @default true for development;
     */
    unstable_sourcemaps: boolean;

    /**
     * Set target
     * @default 'auto'
     */
    unstable_target: Target;
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
    unstable_typescript = false,
    unstable_CSSVariableFallback = true,
    unstable_optimizeBindings = true,
    unstable_useTaggedTemplateLiterals = false,
    unstable_target = 'auto',
}: Partial<CompileOptions> & {filename: string}): ProcessorConfig & {
    useTaggedTemplateLiterals: boolean;
} {
    const getTarget = () => {
        if (unstable_target !== 'auto') return unstable_target;

        const extname = path.extname(filename);

        if (extname === '.vue') return 'vue';

        return 'auto';
    };

    return {
        evaluate,
        typescript: unstable_typescript,
        CSSVariableFallback: unstable_CSSVariableFallback,
        optimizeBindings: unstable_optimizeBindings,

        useTaggedTemplateLiterals: unstable_useTaggedTemplateLiterals,
        target: getTarget(),
    };
}

const findImportPath = (
    program: NodePath<t.Program>,
): undefined | NodePath<t.ImportDeclaration> => {
    let importPath: undefined | NodePath<t.ImportDeclaration> = undefined;

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

    return importPath;
};

let output: Output;
let sourceMapGenerator: SourceMapGenerator;

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

    const {filename, filenameRelative, sourceRoot} = state.file.opts;

    assert(filename, 'Filename is required');
    assert(filenameRelative, 'FilenameRelative is required');

    const importPath = findImportPath(program);

    if (!importPath) return;

    sourceMapGenerator = makeSourceMapGenerator(state.file);

    sourceMapGenerator.setSourceContent(filename, code);

    // TODO: implement "createCSS" and pass it
    $css.ruleInjector.reset();

    const importCache = new Map<string, t.ImportSpecifier>();

    const {useTaggedTemplateLiterals, ...compileOptions} = mapCompileOptions({
        filename,
        ...config.compileOptions,
    });

    switch (compileOptions.target) {
        case 'vue': {
            require('taddy/vue');
            break;
        }
        case 'auto': {
            break;
        }
    }

    const {handlers, finish} = createHandlers(compileOptions, {
        state,
        sourceMapGenerator,
        env,
        filename,
        filenameRelative,
        code,
        addImport(name: string): t.ImportSpecifier['local'] {
            if (!importCache.has(name)) {
                const specifier = t.importSpecifier(
                    t.identifier(`_${name}_`),
                    t.identifier(name),
                );
                importCache.set(name, specifier);

                importPath.node.specifiers.push(specifier);
            }

            return importCache.get(name)!.local;
        },
    });

    for (const key in references) {
        if (!(key in handlers)) continue;

        for (const ref of references[key]) {
            let currentPath = ref.parentPath;
            let currentKey = key;

            if (
                key === 'css' &&
                currentPath?.isMemberExpression() &&
                'name' in currentPath.node.property &&
                currentPath.node.property.name === 'mixin'
            ) {
                currentPath = currentPath.parentPath;
                currentKey = 'mixin';
            }

            if (
                useTaggedTemplateLiterals &&
                (currentKey === 'css' || currentKey === 'mixin') &&
                currentPath?.isTaggedTemplateExpression()
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

    if (isStatic) {
        importPath.node.source = t.stringLiteral('@taddy/core');
    }

    output = output || new Output({env, config: config.outputOptions});

    const sourceMap = convertGeneratorToComment(sourceMapGenerator);

    const result = output.save({
        sourceMap,
        filename,
        target: compileOptions.target,
    });

    importPath.insertAfter(
        t.importDeclaration([], t.stringLiteral(result.importName)),
    );

    return {
        keepImports: true,
    };
}
