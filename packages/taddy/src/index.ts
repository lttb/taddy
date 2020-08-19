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
    const id = '__' + config.nameGenerator.getHash('id' + className);
    return {
        [ID]: id,
        [Symbol?.toPrimitive || 'toString']: () => id,
        className: className + (className ? ' ' : '') + id,
    };
};

const TADDY: unique symbol = Symbol('TADDY');

type CSSResult<T = TaddyRule> = TaddyStyle &
    Record<typeof ID, string> & {
        [TADDY]: T;
    };

const _css = <T extends TaddyRule>(
    ...composes: (T | TaddyRule)[]
): CSSResult<T> => {
    const {className, style} = $css({composes});

    delete className[MIXIN_KEY];

    let classNameString = '';
    for (let key in className) {
        if (!className[key]) continue;

        classNameString += (classNameString ? ' ' : '') + key;

        if (typeof className[key] === 'string') {
            classNameString += className[key];
        }
    }

    // @ts-expect-error
    return Object.assign(withId(classNameString), {style});
};

export const css = (
    ...args: Parameters<typeof _css>
): ReturnType<typeof _css> => config.unstable__mapStyles(_css(...args));

css.mixin = mixin;

css.h = (x) => config.nameGenerator.getHash(x);

export {mixin};

export function $(strs: TemplateStringsArray, ...values: CSSResult[]): string {
    let selector = '';
    strs.forEach((chunk, index) => {
        selector += chunk;
        if (values[index]) {
            selector += '.' + values[index][ID];
        }
    });
    return selector;
}
