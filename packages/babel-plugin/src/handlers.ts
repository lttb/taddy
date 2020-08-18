import * as t from '@babel/types';
import {addNamed, addSideEffect} from '@babel/helper-module-imports';

import type {NodePath, PluginPass} from '@babel/core';

import fs from 'fs';
import nodePath from 'path';

import stringHash from 'string-hash';

import {ruleInjector} from 'taddy';

import {Processor} from './Processor';
import type {ProcessorConfig} from './Processor';
import {optimizeBindings} from './helpers';
import {cacheDir, getCachedModuleFilepath} from './config';

let LAST_INDEX = 0;
let STYLES: string[] = [];

function getStylesState() {
    const {rules} = ruleInjector.styleSheet;
    const newRules = rules.slice(LAST_INDEX);

    LAST_INDEX = rules.length;

    const added = [...newRules].map((rule) => rule.cssText || '');

    STYLES.push(...added);

    return {
        added,
        total: STYLES,
    };
}

function getRelativeFilepath(from: string, to: string): string {
    return './' + nodePath.relative(nodePath.dirname(from), to);
}

type FilenameGetter = (code?: string) => string;
type FilepathGetter = (filename: string) => string;

export type Env = 'development' | 'production' | 'test';

type ExtractCSSType = boolean | 'production' | 'development';

export type OutputOptions = {
    getCSSFilename: FilenameGetter;
    getCSSFilepath: FilepathGetter;
    getJSFilename: FilenameGetter;
    getJSFilepath: FilepathGetter;

    relativeEntryPath: boolean;
    extractCSS: ExtractCSSType;
};

type EntryOptions = {
    jsFilepath: string;
    cssFilepath: string;
    styles: string;
    extractCSS: ExtractCSSType;
};

function writeDevEntry({styles, jsFilepath}: EntryOptions) {
    const template = `
var getStyleNodeById = require('taddy').getStyleNodeById
var STYLES = '${styles}'
var state = {current: STYLES}
var isBrowser = typeof window !== 'undefined'
if (isBrowser && !getStyleNodeById('taddy').innerHTML) {
    state.current = window.__TADDY_STYLES__ = window.__TADDY_STYLES__ || STYLES
    getStyleNodeById('taddy').innerHTML = state.current
}
module.exports.STYLES = STYLES;
module.exports.state = state;
module.exports.taddy_invalidate = function (newStyles) {
    if (!newStyles) return
    state.current += newStyles
    if (isBrowser) getStyleNodeById('taddy').innerHTML += newStyles
}
`;

    fs.writeFile(jsFilepath, template, (error) => {
        if (error) {
            console.error('TADDY WRITEFILE ERROR', error);
        }
    });
}

function writeProdEntry({
    styles,
    jsFilepath,
    cssFilepath,
    extractCSS,
}: EntryOptions) {
    let template: string;

    if (extractCSS) {
        const jsToCSS = getRelativeFilepath(jsFilepath, cssFilepath);
        template = `require('${jsToCSS}');`;
    } else {
        template = `
var getStyleNodeById = require('taddy').getStyleNodeById
var STYLES = '${styles}'
if (typeof window !== 'undefined') {
    getStyleNodeById('taddy').innerHTML = STYLES
}
module.exports.STYLES = STYLES
`;
    }

    if (contentMap.has(template)) {
        return;
    }

    contentMap.set(template, true);

    fs.writeFile(jsFilepath, template, (error) => {
        if (error) {
            console.error('TADDY WRITEFILE ERROR', error);
        }
    });
}

function getMtime(filepath: string): number {
    return Number(fs.statSync(filepath).mtime);
}

const filesMap = new Map();
const contentMap = new Map();

function readFileSync(filepath: string): string {
    let data = '';

    try {
        const mtime = getMtime(filepath);
        if (filesMap.has(mtime)) {
            return filesMap.get(mtime);
        }

        data = fs.readFileSync(filepath).toString();

        filesMap.set(mtime, data);
        contentMap.set(data, mtime);
    } catch (e) {}

    return data;
}

function writeCSSFileSync(filepath: string, content: string, append: string) {
    const code = content + append;
    if (contentMap.has(code)) {
        return;
    }

    fs.appendFileSync(filepath, append);
}

export function output({
    env,
    state,
    config: {
        // getCSSFilename = (content) => `atoms-${stringHash(content)}.css`,
        getCSSFilename = () => `atoms.css`,
        getCSSFilepath = (filename: string) =>
            nodePath.join(cacheDir, filename),

        // getJSFilename = (content) => `entry-${stringHash(content)}.js`,
        getJSFilename = (hash?: string) => {
            return `entry` + (hash ? '.' + hash : '') + '.js';
        },
        getJSFilepath = (filename: string) => nodePath.join(cacheDir, filename),

        relativeEntryPath = false,

        extractCSS = false,
    } = {},
}: {
    env: Env;
    state: PluginPass;
    config?: Partial<OutputOptions>;
}) {
    const {added} = getStylesState();

    const cssFilename = getCSSFilename();
    const cssFilepath = getCSSFilepath(cssFilename);

    const stylesData = readFileSync(cssFilepath);

    // TODO: improve filter performance
    const diffStyles = added.filter((x) => !stylesData.includes(x)).join('');

    let result = stylesData + diffStyles;

    writeCSSFileSync(cssFilepath, stylesData, diffStyles);

    const program = state.file.path as NodePath<t.Program>;
    const {filename} = state;

    function getModulePath(jsFilepath: string): string {
        return relativeEntryPath
            ? getRelativeFilepath(filename, jsFilepath)
            : getCachedModuleFilepath(jsFilepath);
    }

    if (env === 'development') {
        const hash = String(stringHash(result));

        const jsFilename = getJSFilename(hash);
        const jsFilepath = getJSFilepath(jsFilename);

        writeDevEntry({jsFilepath, cssFilepath, extractCSS, styles: result});

        const modulePath = getModulePath(jsFilepath);

        const updaterNameNode = addNamed(
            program,
            'taddy_invalidate',
            modulePath,
        );
        program.pushContainer(
            'body',
            t.callExpression(updaterNameNode, [
                t.stringLiteral(diffStyles),
                t.stringLiteral(hash),
            ]),
        );

        return;
    }

    const jsFilename = getJSFilename();
    const jsFilepath = getJSFilepath(jsFilename);

    writeProdEntry({jsFilepath, cssFilepath, extractCSS, styles: result});

    const modulePath = getModulePath(jsFilepath);

    addSideEffect(program, modulePath);
}

function isPathRemoved(path: NodePath<any>) {
    do {
        if (path.removed) return true;
    } while ((path = path.parentPath));

    return false;
}

export const createProcessors = (config: ProcessorConfig) => {
    const mixinsQueue: NodePath<any>[] = [];
    const proceedPaths: {
        isStatic: boolean;
        optimizationPaths: Set<NodePath<any>>;
    }[] = [];

    const processor = new Processor({config});

    const handlers = {
        css: (
            path: NodePath<t.MemberExpression | t.CallExpression>,
            {mixin = false}: {mixin?: boolean} = {},
        ) => {
            if (
                path.isMemberExpression() &&
                'name' in path.node.property &&
                path.node.property.name === 'mixin'
            ) {
                mixinsQueue.push(path.parentPath);
                return;
            }

            if (!path.isCallExpression()) return;

            const argPath = (path.get('arguments') as NodePath<any>[])[0];

            const result = processor.run(argPath, {
                mixin,
            });

            if (!result) return;

            const {isStatic, optimizationPaths} = result;

            proceedPaths.push({
                isStatic,
                optimizationPaths,
            });

            path.node.arguments = [argPath.node];
        },

        mixin: (path) => handlers.css(path, {mixin: true}),
    };

    return {
        handlers,
        finish() {
            let isStatic = true;

            for (let x of proceedPaths) {
                isStatic = isStatic && x.isStatic;
                for (let path of x.optimizationPaths) {
                    optimizeBindings(path);
                }
            }

            for (let path of mixinsQueue) {
                if (isPathRemoved(path)) {
                    // the path binding should be already optimized
                    continue;
                }

                handlers.css(path, {mixin: true});
            }

            return {isStatic};
        },
    };
};
