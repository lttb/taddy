import {VARS_KEY, MIXIN_KEY} from '../common';

import {config} from '../config';

export const css = (
    rule: string | {className?: string; style?: object; [VARS_KEY]?: object},
) => {
    if (typeof rule === 'string') return {className: rule};

    const result: any = {};

    if (rule.className) result.className = rule.className;
    if (rule.style) result.style = rule.style;
    if (rule[VARS_KEY]) {
        result.style = result.style
            ? {...result.style, ...rule[VARS_KEY]}
            : rule[VARS_KEY];
    }
    return result;
};

css.h = (x) => config.current.nameGenerator.getHash(x);
// eslint-disable-next-line no-sequences
css.mixin = (x: object) => ((x[MIXIN_KEY] = x), x);
