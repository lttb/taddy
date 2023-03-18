import {transformAsync, createConfigItem} from '@babel/core';
import type {TransformOptions} from '@babel/core';

import {stripIndent} from 'common-tags';

import {$css, StyleSheet} from 'taddy';

import taddyPlugin from '../plugin';
import type {MacroConfig} from '../macro-plugin';

export {PACKAGE_NAME} from '../config';

export function getStyles(): string {
    return [...$css.ruleInjector.styleSheet.rules]
        .map((rule) => rule.cssText)
        .join('\n');
}

export function resetStyles() {
    if ($css.ruleInjector.styleSheet instanceof StyleSheet) {
        $css.ruleInjector.styleSheet.node.remove();
    }

    $css.ruleInjector.reset();
}

export const getBabelOptions = (
    options: MacroConfig = {},
): TransformOptions => ({
    filename: `/test.virtual.tsx`,
    babelrc: false,
    configFile: false,
    plugins: [
        ['@babel/plugin-syntax-typescript', {isTSX: true}],

        createConfigItem((babel) =>
            taddyPlugin(babel, {
                compileOptions: {
                    evaluate: false,
                    unstable_typescript: false,
                    ...options.compileOptions,
                },
                outputOptions: {
                    ...options.outputOptions,
                },
            }),
        ),
    ],
});

type Optional<T> = T | null | void;

export async function transform(
    code: string,
    options?: object,
): Promise<Optional<string>> {
    return (await transformAsync(stripIndent(code), getBabelOptions(options)))
        ?.code;
}
