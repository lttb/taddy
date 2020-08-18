/* eslint-disable */

import type {Properties} from 'csstype';

import {config, MIXIN_KEY} from '@taddy/core';
import {ruleInjector, $css} from './$css';
import type {TaddyRule} from './$css';

import {mixin} from './mixin';

export type ExactProp<T extends keyof Properties> = Exclude<
    Properties[T],
    object
>;

export type TaddyStyle = {style?: object; className: string};

export * from './RuleInjector';

export {$css, ruleInjector, config};

const ID = Symbol('ID');
const withId = (className: string) => {
    /**
     * For the reference between different styles
     */
    const id = '__' + config.current.nameGenerator.getHash('id' + className);
    return {
        [ID]: id,
        [Symbol?.toPrimitive || 'toString']: () => id,
        className: className + (className ? ' ' : '') + id,
    };
};

const TADDY: unique symbol = Symbol('TADDY');

export const css = <T extends TaddyRule>(
    rule: T | TaddyRule,
): TaddyStyle &
    Record<typeof ID, string> & {
        [TADDY]: T;
    } => {
    if (typeof rule === 'string') {
        // @ts-ignore
        return withId(rule);
    }

    const {className, style} = $css(rule);

    delete className[MIXIN_KEY];

    let classNameString = '';
    for (let key in className) {
        if (!className[key]) continue;

        classNameString += (classNameString ? ' ' : '') + key;

        if (typeof className[key] === 'string') {
            classNameString += className[key];
        }
    }

    // @ts-ignore
    return Object.assign(withId(classNameString), {style});
};

css.mixin = mixin;
css.h = (x) => config.current.nameGenerator.getHash(x);

export {mixin};

export function $(strs, ...values) {
    let selector = '';
    strs.forEach((chunk, index) => {
        selector += chunk;
        if (values[index]) {
            selector += '.' + values[index][ID];
        }
    });
    return selector;
}
