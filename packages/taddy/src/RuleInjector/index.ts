import {config} from '@taddy/core';

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

type InvalidValue = '' | false | null | void;
export function isInvalidValue(value: any): value is InvalidValue {
    return !(!!value || value === 0);
}

type CSSProp = string;

type Options = {
    postfix?: string;
    inject?: boolean;
};

export {getStyleNodeById} from './common';

export {VirtualStyleSheet, StyleSheet};

export class RuleInjector {
    cache = new Map();

    rulesCache = new Map();

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

        const cssKey = camelToKebab(key);

        const name = nameGenerator.getName(cssKey, value, {
            postfix,
        });
        const nameHash = name.join('');

        const result = Object.create(null);

        // result[propHash + postfixHash] = value
        result[name[0] + name[1]] = name[2];

        if (this.cache.has(nameHash)) {
            return result;
        }

        const originalName = nameGenerator.getName(cssKey, value);
        const originalHash = originalName.join('');

        let ruleIndex;

        const className = `${nameHash}${postfix}`;

        if (this.rulesCache.has(originalHash)) {
            ruleIndex = this.rulesCache.get(originalHash);
            this.styleSheet.appendSelector(ruleIndex, `.${className}`);
        }

        if (ruleIndex === undefined && inject) {
            ruleIndex = this.styleSheet.insertAtomicRule(
                className,
                cssKey,
                value,
            );
        }

        this.cache.set(nameHash, {name, ruleIndex});

        if (ruleIndex !== undefined && ruleIndex >= 0) {
            this.rulesCache.set(originalHash, ruleIndex);
        }

        return result;
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
