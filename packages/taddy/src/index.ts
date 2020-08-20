/* eslint-disable */

import type {Properties} from 'csstype';

import {$, config, MIXIN_KEY, ID_KEY} from '@taddy/core';
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

const withId = (className: string) => {
    /**
     * For the reference between different styles
     */
    const id = '__' + config.nameGenerator.getHash('id' + className);
    return {
        [ID_KEY]: id,
        [Symbol?.toPrimitive || 'toString']: () => id,
        className: className + (className ? ' ' : '') + id,
    };
};

/*

// TODO: at the moment, this kind of opaque type will not work for external modules
// for example, const styles = {base: css({color: 'red'})}

const TADDY: unique symbol = Symbol('TADDY');

*/

type CSSResult<T = TaddyRule> = TaddyStyle & Record<typeof ID_KEY, string>;

const _css = <T extends TaddyRule>(
    rule: (T | TaddyRule | false | void | null)[],
): CSSResult<T> => {
    const {className, style} = $css(
        rule.length <= 1 ? rule[0] : {composes: rule},
    );

    // console.log({rule, className, style});

    delete className[MIXIN_KEY];

    let classNameString = '';
    for (let key in className) {
        if (!className[key]) continue;

        classNameString += (classNameString ? ' ' : '') + key;

        if (typeof className[key] === 'string') {
            classNameString += className[key];
        }
    }

    return Object.assign(withId(classNameString), {style});
};

export const css = (
    ...rule: Parameters<typeof _css>[0]
): ReturnType<typeof _css> => config.unstable__mapStyles(_css(rule));

css.mixin = mixin;

css.h = (x) => config.nameGenerator.getHash(x);

export {mixin, $};
