// import {$css, RuleInjector, VirtualStyleSheet} from 'taddy';

import {registerPlugin, transform} from '@babel/standalone';

import {Project} from 'ts-morph';

import prettier from 'prettier/standalone';
import parserTypescript from 'prettier/parser-typescript';

import tsSyntax from '@babel/plugin-syntax-typescript';

import taddyPlugin from '@taddy/babel-plugin';

registerPlugin('@babel/plugin-syntax-typescript', tsSyntax);

registerPlugin('@taddy/babel-plugin', taddyPlugin);

const {$css, RuleInjector, VirtualStyleSheet} = require('taddy');

// const tsConfigFilePath = require.resolve('../tsconfig.json');

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

const getOptions = (options) => ({
    envName: 'production',
    root: __dirname,
    filename: __filename + '.virtual.tsx',
    plugins: [
        ['@babel/plugin-syntax-typescript', {isTSX: true}],
        [
            '@taddy/babel-plugin',
            {
                compileOptions: {
                    ...options,
                    typescript: options.typescript ? project : false,
                },
            },
        ],
    ],
});

async function _transform(code, options) {
    const {ruleInjector: currentInjector} = $css;

    const compileInjector = new RuleInjector();
    compileInjector.styleSheet = new VirtualStyleSheet();

    $css.ruleInjector = compileInjector;
    const result = await transform(code, getOptions(options));
    $css.ruleInjector = currentInjector;

    return {
        code: prettier.format(result.code, {
            parser: 'typescript',
            plugins: [parserTypescript],
        }),
        css: [...compileInjector.styleSheet.rules]
            .map((x) => x.cssText)
            .join('\n'),
    };
}
setTimeout(() => {
    // first init for better update performance later
    _transform(
        `import {css} from 'taddy'; declare var color: 'red' | 'blue'; css({color})`,
        {evaluate: true, typescript: true},
    );
});

export async function transformCode(source, options) {
    try {
        const {code, css} = await _transform(source, options);

        return {code, css};
    } catch (error) {
        console.error('compile error', error);
    }

    return {code: source, css: ''};
}
