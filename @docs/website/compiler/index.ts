// import {$css, RuleInjector, VirtualStyleSheet} from 'taddy';
import {$css, media, RuleInjector, VirtualStyleSheet} from 'taddy';

import {registerPlugin, transform} from '@babel/standalone';

import prettier from 'prettier/standalone';
import parserTypescript from 'prettier/parser-typescript';

import tsSyntax from '@babel/plugin-syntax-typescript';

import taddyPlugin from '@taddy/babel-plugin/src';
import {format} from 'path';
import fs from 'fs';

registerPlugin('@babel/plugin-syntax-typescript', tsSyntax);

registerPlugin('@taddy/babel-plugin', taddyPlugin);

function waitForTypescrit() {
    function inner(resolve) {
        if (typeof window === 'undefined' || (window as any).ts?.version) {
            resolve();
            return;
        }

        setTimeout(() => {
            inner(resolve);
        }, 500);
    }

    return new Promise(inner);
}

async function init() {
    await waitForTypescrit();

    const {Project} = await import('ts-morph');

    const project = new Project({
        useInMemoryFileSystem: true,
        compilerOptions: {
            lib: ['DOM', 'ESNext'],
            allowJs: false,
            noEmit: true,
            skipLibCheck: true,
            noImplicitAny: false,
            baseUrl: '.',
            // strict: false,
            // forceConsistentCasingInFileNames: false,
            // noEmit: true,
            // esModuleInterop: true,
            // resolveJsonModule: true,
            // isolatedModules: true,
            // experimentalDecorators: true,
            // noImplicitAny: true,
            // strictFunctionTypes: true,
            // jsx: 'preserve',
        },
    });

    project.createSourceFile(
        'node_modules/taddy/index.ts',
        `
    declare function mixin<
        K extends string,
        V extends string | number | void,
        T extends Record<K, V>
    >(x: T): {
        [key in keyof T]: T[key]
    }

    const css = <T>(rule: T): T => rule;
    css.mixin = mixin

    export {css, mixin}
    `,
    );

    const getOptions = (options, babelOptions: any = {}) => ({
        envName: 'production',
        root: __dirname,
        filename: __filename + '.virtual.tsx',
        presets: [...(babelOptions.presets || [])],
        plugins: [
            ...(babelOptions.plugins || []),
            ['@babel/plugin-syntax-typescript', {isTSX: true}],
            [
                '@taddy/babel-plugin',
                {
                    compileOptions: {
                        ...options,
                        unstable_typescript: options.unstable_typescript
                            ? project
                            : false,
                    },
                },
            ],
        ],
    });

    const {ruleInjector: currentInjector} = $css;

    async function _transform(
        code,
        {format = true, plugins, presets, ...options}: any = {},
    ) {
        const compileInjector = new RuleInjector({virtual: true});
        compileInjector.styleSheet = new VirtualStyleSheet();

        $css.ruleInjector = compileInjector;

        let result;
        let error;
        try {
            result = transform(code, getOptions(options, {plugins, presets}));
        } catch (e) {
            error = e;
        }

        $css.ruleInjector = currentInjector;

        if (error) {
            throw error;
        }

        compileInjector.styleSheet.cache.forEach(
            ({key, value, postfix, media}) => {
                $css.ruleInjector.styleSheet.insert(key, value, {
                    postfix,
                    media,
                });
            },
        );

        let compiledCode = result.code;
        if (format) {
            compiledCode = prettier.format(compiledCode, {
                parser: 'typescript',
                plugins: [parserTypescript],
            });
        }

        const compiledCSS = [...compileInjector.styleSheet.rules]
            .map((x) => x.cssText)
            .join('\n');

        return {
            code: compiledCode,
            css: compiledCSS,
        };
    }
    setTimeout(() => {
        // first init for better update performance later
        _transform(`import {css} from 'taddy'; css({color: 'initial'})`, {
            evaluate: true,
            unstable_typescript: true,
        });
    });

    return _transform;
}

const _transform = init();

export async function transformCode(source, options) {
    return await (
        await _transform
    )(source, options);
}
