import {config, isInvalidValue} from '@taddy/core';

import {camelToKebab} from './common';

import {VirtualStyleSheet} from './VirtualStyleSheet';
import {StyleSheet} from './StyleSheet';

export const NESTED = Symbol('__NESTED__');

function isNested(value: object | unknown): boolean {
    return value && typeof value === 'object';
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
    inject?: boolean;
};

export {getStyleNodeById} from './common';

export {VirtualStyleSheet, StyleSheet};

export class RuleInjector {
    styleSheet =
        typeof document === 'undefined'
            ? new VirtualStyleSheet()
            : new StyleSheet();

    reset() {
        Object.assign(this, new RuleInjector());
    }

    put(key: CSSPseudo, value: Atom, options?: Options): Atom | null;

    put(key: CSSProp, value: string | boolean, options?: Options): Atom | null;

    put(key, value, {postfix = '', inject = true} = {}): Atom | null {
        if (isInvalidValue(value)) return null;

        // {'a b c': !0}
        if (value === true) {
            return {[key]: true};
        }

        if (isPseudo(key)) {
            return this.putNested(postfix + key, value, {inject});
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
                [postfix + key]: nameGenerator.getValueHash(value),
            };
        }

        if (isNested(value)) {
            return this.putNested(postfix + key, value, {inject});
        }

        return this.styleSheet.insert(key, value, {postfix, inject});
    }

    putNested(selector: string, rule: Atom, {inject = true} = {}): Atom | null {
        if (!rule) return null;

        const classNames = Object.create(null);

        for (const key in rule) {
            const className = this.put(key, rule[key], {
                postfix: selector,
                inject,
            });

            Object.assign(classNames, className);
        }

        return classNames;
    }
}
