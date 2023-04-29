import type {NodePath} from '@babel/core';

import evaluatePath from 'babel-helper-evaluate-path';

import rpc from 'sync-rpc';

import {MACRO_NAME, PACKAGE_NAME} from '../config';

import {findBindings} from './findBindings';
import {buildCodeByPath} from './buildCodeByPath';

const evaluateChunk = rpc(__dirname + '/evaluate.worker.js', 'Evaluate');

const macroRe = new RegExp(MACRO_NAME.replace('.', '\\.'), 'g');

export function evaluate(
    currentPath: NodePath<any>,
    {exec = true}: {exec?: boolean},
):
    | {
          value: any;
      }
    | {error: Error} {
    const result = evaluatePath(currentPath);

    if (result.confident) {
        findBindings(currentPath);

        return {value: result.value};
    }

    if (!exec) return {error: new Error('EXEC_REQUIRED')};

    let content = '';

    try {
        const callbackName = '__taddy__';

        content = buildCodeByPath(currentPath)
            // hack to avoid processing by babel-macro
            .replace(macroRe, PACKAGE_NAME)
            .concat(`\n\n;${callbackName}(${currentPath.toString()})`);

        // TODO: improve Hub type
        const {opts} = (currentPath.hub as any).file;

        const {value, error} = evaluateChunk({
            content,
            filename: opts.filename,
            callbackName,
        });

        if (error) return {error};

        return {value};
    } catch (error: any) {
        // console.log('evaluate error', {content, error});

        return {error};
    }
}
