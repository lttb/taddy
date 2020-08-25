import * as t from '@babel/types';

import type {NodePath, PluginPass, ConfigAPI} from '@babel/core';

import fs from 'fs';
import nodePath from 'path';
import stringHash from 'string-hash';

import {ruleInjector} from 'taddy';

import {Processor} from './Processor';
import type {ProcessorConfig, ProcessOptions} from './Processor';
import {BindingOptimizer} from './helpers';
import {getCacheDir, getRootDir} from './config';

import type {Env} from './types';

let LAST_INDEX = 0;
let STYLES: string[] = [];

function getStylesState() {
    const {rules} = ruleInjector.styleSheet;
    const newRules = rules.slice(LAST_INDEX);

    // there is also "appending" rules, that don't change the index, but change the rule
    // TODO: think how to handle that
    // LAST_INDEX = rules.length;

    const added = [...newRules].map((rule) => rule.cssText || '');

    // STYLES.push(...added);

    return {
        added,
    };
}

type FilenameGetter = string | ((code?: string) => string);
type FilepathGetter = string | ((filename: string) => string);

function resolveFilepath<T extends FilenameGetter | FilepathGetter>(
    getter: T,
    ...params: T extends (...args: any) => any ? Parameters<T> : []
): string {
    if (typeof getter !== 'string') {
        // @ts-expect-error
        return getter(...params);
    }

    return nodePath.join(getRootDir(), getter);
}

type ExtractCSSType = boolean | 'production' | 'development';

export type OutputOptions = {
    cssFilename: FilenameGetter;
    cssFilepath: FilepathGetter;

    jsFilename: FilenameGetter;
    jsFilepath: FilepathGetter;

    relativeEntryPath: boolean;
    extractCSS: ExtractCSSType;
};

type EntryOptions = {
    jsFilepath: string;
    cssFilepath: string;
    styles: string;
    extractCSS: ExtractCSSType;
};

export function getEnv(babel: ConfigAPI): Env {
    try {
        return babel.env() as Env;
    } catch (e) {
        // console.log('error', e);
    }

    const DEFAULT_ENV = 'production';

    if (!(typeof process && process.env)) {
        return DEFAULT_ENV;
    }

    return (process.env.BABEL_ENV ||
        process.env.NODE_ENV ||
        DEFAULT_ENV) as Env;
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

function appendFile(filepath: string, content: string, append: string) {
    const code = content + append;
    if (contentMap.has(code)) {
        return;
    }

    // TODO: think about asynchronous appending
    if ('appendFileSync' in fs) {
        fs.appendFileSync(filepath, append);
    } else {
        // workaround for some special FS cases like "filer"
        // @ts-expect-error
        fs.appendFile(filepath, append, () => {});
    }
}

export function output({
    env,
    state,
    config: {
        // getCSSFilename = (content) => `atoms-${stringHash(content)}.css`,
        cssFilename = () => `taddy.css`,
        cssFilepath = (filename: string = 'taddy.css') =>
            nodePath.join(getCacheDir(), filename),
    } = {},
}: {
    env: Env;
    state: PluginPass;
    config?: Partial<OutputOptions>;
}) {
    const {added} = getStylesState();

    const filename = resolveFilepath(cssFilename);
    const filepath = resolveFilepath(cssFilepath, filename);

    const stylesData = readFileSync(filepath);

    // TODO: improve filter performance
    const diffStyles = added.filter((x) => !stylesData.includes(x)).join('');

    appendFile(filepath, stylesData, diffStyles);
}

function isPathRemoved(path: NodePath<any>) {
    do {
        if (path.removed) return true;
    } while ((path = path.parentPath));

    return false;
}

export const createProcessors = (
    config: ProcessorConfig,
    options: Omit<ProcessOptions, 'mixin'>,
) => {
    const mixinsQueue: NodePath<any>[] = [];
    const proceedPaths: {
        path: NodePath<t.CallExpression>;
        isStatic: boolean;
        optimizationPaths: Set<NodePath<any>>;
    }[] = [];

    const cssQueue: {path: NodePath<t.CallExpression>; mixin: boolean}[] = [];

    const processor = new Processor({config});
    const optimizer = new BindingOptimizer();

    let counter = 0;
    const addHashId = (path: NodePath<t.CallExpression>) => {
        path.node.arguments.push(
            t.stringLiteral(
                '__' +
                    stringHash(
                        nodePath.relative(getRootDir(), options.filename) +
                            ':' +
                            ++counter,
                    ).toString(32),
            ),
        );
    };

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

            if (path.isCallExpression()) {
                cssQueue.push({path, mixin});

                return;
            }
        },

        mixin: (path) => {
            mixinsQueue.push(path);
        },
    };

    function processCSS({
        path,
        mixin,
    }: {
        path: NodePath<t.CallExpression>;
        mixin: boolean;
    }) {
        const result = processor.run(path, {
            ...options,
            mixin,
        });

        if (!result) return;

        const {isStatic, optimizationPaths} = result;

        proceedPaths.push({
            path,
            isStatic,
            optimizationPaths,
        });

        if (!mixin) {
            addHashId(path);
        }
    }

    return {
        handlers,
        finish(): {isStatic: boolean} {
            cssQueue.forEach(processCSS);

            let isStatic = false;

            if (config.optimizeBindings) {
                isStatic = true;

                for (let x of proceedPaths) {
                    isStatic = isStatic && x.isStatic;
                    for (let path of x.optimizationPaths) {
                        optimizer.process(path);
                    }
                }
            }

            for (let path of mixinsQueue) {
                if (config.optimizeBindings && isPathRemoved(path)) {
                    // the path binding should be already optimized
                    continue;
                }

                isStatic = false;

                processCSS({path, mixin: true});
            }

            if (!isStatic) {
                for (let x of proceedPaths) {
                    if (!x.isStatic) continue;
                    const {path} = x;

                    path.replaceWith(
                        t.callExpression(
                            t.memberExpression(
                                path.node.callee as t.Identifier,
                                t.identifier('static'),
                            ),
                            path.node.arguments,
                        ),
                    );
                }
            }

            return {isStatic};
        },
    };
};
