import type {NodePath} from '@babel/core';

import {transform, registerPreset} from '@babel/standalone';

import register, {revert} from '@babel/register';
import evaluatePath from 'babel-helper-evaluate-path';
import resolve from 'resolve';
import path from 'path';

import * as taddy from 'taddy';

import {MACRO_NAME, PACKAGE_NAME} from '../config';
import {EVAL_FILENAME_POSTFIX} from './utils';

import {findBindings} from './findBindings';
import {buildCodeByPath} from './buildCodeByPath';

import tsPreset from '@babel/preset-typescript';
import reactPreset from '@babel/preset-react';
import envPreset from '@babel/preset-env';

registerPreset('@babel/preset-typescript', tsPreset);
registerPreset('@babel/preset-react', reactPreset);
registerPreset('@babel/preset-env', envPreset);

const DEFAULT_PRESETS = [
    ['@babel/preset-typescript', {allExtensions: true, isTSX: true}],
    '@babel/preset-react',
    [
        '@babel/preset-env',
        {
            targets: {node: '12'},
            useBuiltIns: false,
            ignoreBrowserslistConfig: true,
        },
    ],
];

const EXTENSIONS = ['.es6', '.es', '.tsx', '.ts', '.jsx', '.js', '.mjs'];

const macroRe = new RegExp(MACRO_NAME.replace('.', '\\.'), 'g');

// webpack "require" critical dependency issue workaround
const nodeRequire = new Function(
    'require',
    `return typeof require !== 'undefined'
        ? require
        : (typeof globalThis !== 'undefined' ? globalThis : global).require; `,
)(module.require);

export function evaluate(currentPath: NodePath<any>): {
    value?: any;
    error?: Error;
} {
    const result = evaluatePath(currentPath);

    if (result.confident) {
        findBindings(currentPath);

        return {value: result.value};
    }

    let content = '';
    let code: void | null | string = '';

    try {
        const callbackName = '__taddy__';

        content = buildCodeByPath(currentPath)
            // hack to avoid processing by babel-macro
            .replace(macroRe, PACKAGE_NAME)
            .concat(`\n\n;${callbackName}(${currentPath.toString()})`);

        // TODO: improve Hub type
        const {opts} = (currentPath.hub as any).file;

        const ext = path.extname(opts.filename);
        const basename = path.basename(opts.filename, ext);
        const dirname = path.dirname(opts.filename);
        const filename = path.join(
            dirname,
            basename + EVAL_FILENAME_POSTFIX + ext,
        );

        const options = {
            babelrc: false,
            configFile: false,
            filename,
            plugins: [
                /*...opts.plugins*/
            ],
            presets: [/*...opts.presets*/ ...DEFAULT_PRESETS],
        };

        ({code} = transform(content, options) || {});

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

                const requirePath = resolve.sync(filepath, {
                    extensions: EXTENSIONS,
                    basedir: path.dirname(opts.filename),
                });

                return nodeRequire(requirePath);
            },
            (result: any) => {
                value = result;
            },
        );

        revert();

        return {value};
    } catch (error: any) {
        // console.log('evaluate error', {content, code, error});

        return {error};
    }
}
