/* eslint-disable global-require, import/no-dynamic-require, no-new-func */

import {transformSync} from '@babel/core';

import type {PluginPass, NodePath} from '@babel/core';

import register, {revert} from '@babel/register';
import evaluatePath from 'babel-helper-evaluate-path';
import resolve from 'resolve';
import path from 'path';

import * as taddy from 'taddy';

import {MACRO_NAME, PACKAGE_NAME} from '../config';

import {buildCodeByPath} from './buildCodeByPath';

const DEFAULT_PRESETS = [
    '@babel/preset-typescript',
    '@babel/preset-react',
    ['@babel/preset-env', {targets: {node: 'current'}}],
];

const EXTENSIONS = ['.es6', '.es', '.tsx', '.ts', '.jsx', '.js', '.mjs'];

const macroRe = new RegExp(MACRO_NAME.replace('.', '\\.'), 'g');

const EVAL_FILENAME_POSTFIX = '@__TADDY_EVALUATE__';

export function isTaddyEvaluation(state: PluginPass): boolean {
    return state.filename.includes(EVAL_FILENAME_POSTFIX);
}

export function evaluate(
    currentPath: NodePath<any>,
): {value?: any; error?: Error} {
    const result = evaluatePath(currentPath);

    if (result.confident) {
        return {value: result.value};
    }

    try {
        const callbackName = '__taddy__';

        const content = buildCodeByPath(currentPath)
            // hack to avoid processing by babel-macro
            .replace(macroRe, PACKAGE_NAME)
            .concat(`${callbackName}(${currentPath.toString()})`);

        const {opts} = currentPath.hub.file;

        const ext = path.extname(opts.filename);
        const basename = path.basename(opts.filename, ext);
        const dirname = path.dirname(opts.filename);

        const options = {
            babelrc: false,
            configFile: false,
            filename: path.join(
                dirname,
                basename + EVAL_FILENAME_POSTFIX + ext,
            ),
            plugins: [
                /*...opts.plugins*/
            ],
            presets: [/*...opts.presets*/ ...DEFAULT_PRESETS],
        };

        // console.log({content});

        const {code} = transformSync(content, options) || {};

        if (!code) return {};

        const exec = new Function('require', callbackName, code);

        register({
            ...options,
            extensions: EXTENSIONS,
        });

        let value;

        exec(
            (filepath: string) => {
                if (filepath === PACKAGE_NAME) return taddy;

                return require(resolve.sync(filepath, {
                    extensions: EXTENSIONS,
                    basedir: path.dirname(opts.filename),
                }));
            },
            (result: any) => {
                value = result;
            },
        );

        revert();

        return {value};
    } catch (error) {
        // console.log({error});

        return {error};
    }
}
