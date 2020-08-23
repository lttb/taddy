/* eslint-disable */

import type {Properties} from 'csstype';

import {
    css as staticCSS,
    $,
    withId,
    config,
    MIXIN_KEY,
    ID_KEY,
    joinClassName,
} from '@taddy/core';
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

/*

// TODO: at the moment, this kind of opaque type will not work for external modules
// for example, const styles = {base: css({color: 'red'})}

const TADDY: unique symbol = Symbol('TADDY');
*/

type CSSResult<T = TaddyRule> = TaddyStyle & Record<typeof ID_KEY, string>;

const getId = (rule: any[]): string | void => {
    if (rule.length <= 1) return;
    const maybeId = rule[rule.length - 1];
    if (maybeId && maybeId[0] === '_' && maybeId[1] === '_') {
        return rule.pop();
    }
};

const _css = <T extends TaddyRule | {[key: string]: TaddyRule}>(
    rule: (T | TaddyRule | false | void | null | string)[],
): CSSResult => {
    let id = getId(rule);

    const {className, style} = $css(
        rule.length <= 1 ? rule[0] : {composes: rule},
    );

    delete className[MIXIN_KEY];

    let classNameString = joinClassName(className);

    return withId({className: classNameString, style}, id);
};

export const css = (
    ...rule: Parameters<typeof _css>[0]
): ReturnType<typeof _css> => config.unstable_mapStyles(_css(rule));

css.mixin = mixin;

export const h = (x) => config.nameGenerator.getHash(x);

css.h = h;

css.static = (...args: any[]) => staticCSS(...args);
// @ts-expect-error
css.mixin.static = staticCSS.mixin;

export {mixin, $};
