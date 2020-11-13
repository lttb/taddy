import {config, isInvalidValue} from '@taddy/core';

import type {SheetOptions} from './Sheet';
import {VirtualStyleSheet} from './VirtualStyleSheet';
import {StyleSheet} from './StyleSheet';

export const NESTED = Symbol('__NESTED__');

function isNested(value: object | unknown): value is Atom {
    return value && typeof value === 'object';
}

function isMedia(
    value: object | unknown,
): value is {'@media': string; rule: Atom} {
    return isNested(value) && !!value['@media'];
}

type Atom = {[key: string]: string | boolean};

type CSSPseudo = string;
function isPseudo(key): key is CSSPseudo {
    return key[0] === ':';
}

function isStatic(key): boolean {
    return key[0] === '_';
}

type CSSProp = string;

type Options = {
    postfix?: string;
    media?: string;
};

export {getStyleNodeById} from './common';

export {VirtualStyleSheet, StyleSheet};

export class RuleInjector {
    options?: SheetOptions;
    styleSheet: VirtualStyleSheet | StyleSheet;

    constructor(options?: SheetOptions) {
        this.options = options;

        this.styleSheet =
            typeof document === 'undefined'
                ? new VirtualStyleSheet(options)
                : new StyleSheet(options);
    }

    reset() {
        Object.assign(this, new RuleInjector(this.options));
    }

    put(key: CSSPseudo, value: Atom, options?: Options): Atom | null;

    put(key: CSSProp, value: string | boolean, options?: Options): Atom | null;

    put(key, value, {postfix = '', media = ''}: Options = {}): Atom | null {
        if (isInvalidValue(value)) return null;

        // {'a b c': !0}
        if (value === true) {
            return {[key]: true};
        }

        if (isPseudo(key)) {
            return this.putNested(value, {postfix: postfix + key, media});
        }

        // check if that's id
        if (key[0] === '_' && key[1] === '_') {
            return {[key]: value};
        }

        const {nameGenerator} = config;

        if (isStatic(key)) {
            /** Static value */
            if (value[0] === '_') {
                return {[postfix + key]: value};
            }

            /** Dynamic values (with precompiled values) */
            return {
                [postfix + key]: nameGenerator.getHash(value),
            };
        }

        if (isMedia(value)) {
            return this.putNested(value.rule, {
                postfix,
                media: value['@media'],
            });
        }

        if (isNested(value)) {
            return this.putNested(value, {postfix: postfix + key, media});
        }

        return this.styleSheet.insert(key, value, {postfix, media});
    }

    private putNested(
        rule: Atom,
        {postfix, media}: {postfix: string; media?: string},
    ): Atom | null {
        if (!rule) return null;

        const classNames = Object.create(null);

        for (const key in rule) {
            const className = this.put(key, rule[key], {
                media,
                postfix,
            });

            Object.assign(classNames, className);
        }

        return classNames;
    }
}
