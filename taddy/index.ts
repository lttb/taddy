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
import {$css} from './$css';
import type {TaddyRule} from './types';

import {mixin} from './mixin';
import {at} from './at';
import {processRules} from './react-native/processStyles';

export type ExactProp<T extends keyof Properties> = Exclude<
    Properties[T],
    object
>;

export type TaddyStyle = {style?: any; className: string};

export * from './RuleInjector';

export {$css, config};

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

function _css<T extends TaddyRule | {[key: string]: TaddyRule}>(
    rule: (T | TaddyRule | false | void | null | string)[],
): CSSResult {
    const id = getId(rule);

    const result = $css(rule.length <= 1 ? rule[0] : {composes: rule});

    if (result.className) {
        delete result.className[MIXIN_KEY];

        // @ts-expect-error fix types
        result.className = joinClassName(result.className);
    }

    return withId(result, id);
}

/**
 * tagged template literal interface works only with babel-plugin
 */
export function css(str: TemplateStringsArray, ...values: any[]): CSSResult;
export function css(
    ...rule: Parameters<typeof _css>[0]
): ReturnType<typeof _css>;

export function css(...rule) {
    if (config.unstable_target === 'react-native') {
        return processRules(rule);
    }

    return config.unstable_mapStyles(_css(rule));
}

css.mixin = mixin;
css.at = at;

export const h = (x) => config.nameGenerator.getHash(x);

css.h = h;

css.static = (...args: any[]) => staticCSS(...args);

// @ts-expect-error "static" doesn't exist
css.mixin.static = staticCSS.mixin;

export {mixin, at, $};
