import * as t from '@babel/types';

import type {NodePath} from '@babel/core';

import nodePath from 'path';
import stringHash from 'string-hash';

import {$css} from 'taddy';

import {Processor} from './Processor';
import type {ProcessorConfig, ProcessOptions} from './Processor';
import {BindingOptimizer} from './helpers';
import {getRootDir} from './config';

function isPathRemoved(path: NodePath<any> | null | undefined) {
    do {
        if (path?.removed) return true;
    } while ((path = path?.parentPath));

    return false;
}

export const createHandlers = (
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

        const cssLength = $css.ruleInjector.styleSheet.rules.join('').length;

        // console.log(options.state.file.opts.generatorOpts.sourceFileName);

        const source = options.state?.file.opts.generatorOpts?.sourceFileName;
        const locStart = path.node.loc?.start;

        if (source && locStart) {
            options.sourceMapGenerator?.addMapping({
                generated: {
                    line: 1,
                    column: cssLength,
                },
                source,
                original: locStart,
            });
        }

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

            let isStatic = true;

            for (let x of proceedPaths) {
                isStatic = isStatic && x.isStatic;

                if (!config.optimizeBindings) continue;

                for (let path of x.optimizationPaths) {
                    optimizer.process(path);
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

            /**
             * If it's not a static file, map only static usages
             */
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
