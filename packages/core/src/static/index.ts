import {VARS_KEY, MIXIN_KEY, ID_KEY} from '../common';

import {config} from '../config';

export const ORIGINAL_CLASSNAME = Symbol('ORIGINAL_CLASSNAME');
export const CLASSNAME = Symbol('RULE_KEY');

const VALUE_HASH_LENGTH = 5;

export const staticCache = {};
export const mapStaticClassName = (className: string): object => {
    if (!className) return {};
    let v = staticCache[className];
    if (v) return v;
    return (staticCache[className] = className
        .split(' ')
        .reduce(
            (acc, v) => (
                (acc[v.slice(0, -VALUE_HASH_LENGTH)] =
                    v.slice(-VALUE_HASH_LENGTH) || true),
                acc
            ),
            {},
        ));
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

export const mergeClassNames = (className1, className2) => {
    if (!(className2 && className2[CLASSNAME])) return className1;
    if (typeof className2[CLASSNAME] === 'string') {
        Object.assign(className1, mapStaticClassName(className2[CLASSNAME]));
    } else {
        Object.assign(className1, className2[CLASSNAME]);
    }

    return className1;
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

    if (result.style) {
        result.style[ID_KEY] = value;
    }

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
        return withId({className: rule, style: {[CLASSNAME]: rule}}, id);
    }

    const result: any = {className: ''};

    let style = {};

    let className = {};

    for (let key in rule) {
        if (rule[key] === true) {
            Object.assign(className, mapStaticClassName(key));

            continue;
        }
        if (key === 'className') {
            if (!rule.className) continue;

            Object.assign(className, mapStaticClassName(rule.className));

            continue;
        }
        if (key === 'style') {
            Object.assign(style, rule.style);

            continue;
        }
        if (key === VARS_KEY) {
            Object.assign(style, rule[VARS_KEY]);

            continue;
        }
    }

    result.className = joinClassName(className);

    result.style = style;

    // try {
    //     // result.style[CLASSNAME] = result.className;
    // } catch (er) {
    //     console.log(
    //         'css static',
    //         er,
    //         result.style,
    //         rule.style,
    //         result.className,
    //     );
    // }

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
