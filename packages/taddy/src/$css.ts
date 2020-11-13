/* eslint-disable */

import {
    config,
    VARS_KEY,
    MIXIN_KEY,
    isInvalidValue,
    mapStaticClassName,
} from '@taddy/core';
import {RuleInjector} from './RuleInjector';

export type InternalTaddyStyle = {style?: object; className: object};

const isDev = __DEV__;

export const $css = (
    rule,
    {postfix = '', sourceMap = ''} = {},
): InternalTaddyStyle => {
    if (!rule) {
        return {className: {}};
    }

    const className = Object.create(null);
    let style;

    function assignStyle(x: object) {
        if (!x) return;
        Object.assign((style = style || {}), x);
    }

    function applyMixin(currentRule) {
        const mixinStyle = currentRule.style;
        const mixinVars = currentRule[VARS_KEY];
        const mixinClassName = currentRule.className;

        assignStyle(mixinStyle);
        assignStyle(mixinVars);
        Object.assign(className, mixinClassName);
    }

    function process(rule) {
        if (typeof rule === 'string') {
            Object.assign(className, {[rule]: true});
            return;
        }

        for (const key in rule) {
            if (isInvalidValue(rule[key])) continue;

            // @ts-expect-error
            if (key === MIXIN_KEY) continue;

            if (key === 'composes') {
                rule[key].forEach((mixin) => {
                    if (!mixin) return;

                    if (mixin[MIXIN_KEY]) {
                        applyMixin(mixin[MIXIN_KEY]);
                        return;
                    }

                    // support plain objects
                    process(mixin);
                });

                continue;
            }

            if (key === 'style' || key === VARS_KEY) {
                assignStyle(rule[key]);
                continue;
            }

            if (key === 'className') {
                Object.assign(className, mapStaticClassName(rule[key]));

                continue;
            }

            const name = $css.ruleInjector.put(key, rule[key], {
                postfix,
            });

            Object.assign(className, name);
        }
    }

    process(rule);

    if (isDev) {
        const cssesc = require('cssesc');
        const v = JSON.stringify(
            rule,
            (key, value) => {
                if (value && value['@media']) {
                    return value.rule;
                }
                return value;
            },
            2,
        );
        const hash = config.nameGenerator.getName('--taddy-dev', v).join('');
        $css.ruleInjector.styleSheet.insertDevRule(
            `.${hash}{--taddy-dev: /*${v}*/0;${sourceMap}}`,
        );

        Object.assign(className, {[hash]: true});
    }

    const result: InternalTaddyStyle = {className};

    if (style) {
        result.style = style;
    }

    return result;
};

$css.ruleInjector = new RuleInjector();
