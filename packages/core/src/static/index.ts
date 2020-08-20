import {VARS_KEY, MIXIN_KEY, ID_KEY} from '../common';

import {config} from '../config';

const _css = (
    rule: string | {className?: string; style?: object; [VARS_KEY]?: object},
): {className: string; style?: object} => {
    if (typeof rule === 'string') {
        return {className: rule};
    }

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

export const css = (
    ...args: Parameters<typeof _css>
): ReturnType<typeof _css> => config.unstable__mapStyles(_css(...args));

css.h = (x) => config.nameGenerator.getHash(x);
// eslint-disable-next-line no-sequences
css.mixin = (x: object) => ((x[MIXIN_KEY] = _css(x)), x);

export function $(strs: TemplateStringsArray, ...values: any[]): string {
    let selector = '';
    strs.forEach((chunk, index) => {
        selector += chunk;
        if (values[index]) {
            selector += '.' + values[index][ID_KEY];
        }
    });
    return selector;
}
