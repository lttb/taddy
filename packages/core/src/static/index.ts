import {VARS_KEY, MIXIN_KEY, ID_KEY} from '../common';

import {config} from '../config';

const VALUE_HASH_LENGTH = 5;

export const staticCache = {};
export const mapStaticClassName = (className?: string): object => {
    if (!className) return {};
    let v = staticCache[className];
    if (v) return v;
    return (staticCache[className] = className.split(' ').reduce((acc, v) => {
        if (v.length < VALUE_HASH_LENGTH) acc[v] = true;
        else acc[v.slice(0, -VALUE_HASH_LENGTH)] = v.slice(-VALUE_HASH_LENGTH);
        return acc;
    }, {}));
};

export const joinClassName = (className: object): string => {
    let classNameString = '';
    for (let key in className) {
        if (!className[key]) continue;

        classNameString += (classNameString ? ' ' : '') + key;
        if (typeof className[key] === 'string') {
            classNameString += className[key];
        }
    }
    return classNameString;
};

export const withId = (result, id?: string | void) => {
    /**
     * For the reference between different styles
     */
    const value =
        id || '__' + config.nameGenerator.getHash('id' + result.className);

    result[ID_KEY] = value;
    result[Symbol?.toPrimitive || 'toString'] = () => '.' + value;
    result.className += (result.className ? ' ' : '') + value;

    return result;
};

const _css = (
    rule?:
        | string
        | Partial<{
              className: string;
              style: object;
              [VARS_KEY]: object;
              [key: string]: any;
          }>,
    id?: string,
): {className: string; style?: object} => {
    if (!rule) return {className: ''};

    if (typeof rule === 'string') {
        return withId({className: rule}, id);
    }

    const result: any = {className: ''};

    let style;

    let className = {};

    for (let key in rule) {
        if (!rule[key]) continue;

        if (rule[key] === true) {
            Object.assign(className, mapStaticClassName(key));

            continue;
        }
        if (key === 'className') {
            Object.assign(className, mapStaticClassName(rule[key]));

            continue;
        }
        if (key === 'style' || key === VARS_KEY) {
            Object.assign((style = style || {}), rule[key]);

            continue;
        }
    }

    result.className = joinClassName(className);

    if (style) {
        result.style = style;
    }

    return withId(result, id);
};

export const css = (
    ...args: Parameters<typeof _css>
): ReturnType<typeof _css> => config.unstable_mapStyles(_css(...args));

css.h = (x) => config.nameGenerator.getHash(x);
// eslint-disable-next-line no-sequences
css.mixin = (x: object) => ((x[MIXIN_KEY] = _css(x)), x);

css.static = css;
// @ts-expect-error
css.mixin.static = css.mixin;

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
