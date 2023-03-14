import {config} from '@taddy/core';

import {camelToKebab} from './common';

export type SheetOptions = {
    mergeDeclarations?: boolean;
    virtual?: boolean;
};

abstract class Sheet {
    options: SheetOptions;
    cache: Map<string, any>;
    rulesCache: Map<string, any>;

    abstract insertAtRule(key: {name: string; query: string}): number;

    abstract insertAtomicRule(
        className: string,
        key: string,
        value: string,
        options: {postfix?: string; atRuleIndex?: number},
    ): number;

    abstract appendSelector(
        ruleIndex: number,
        selector: string,
        options?: {atRuleIndex?: number},
    ): void;

    constructor(options: SheetOptions = {}) {
        this.options = Object.assign({mergeDeclarations: true}, options);

        this.cache = new Map();
        this.rulesCache = new Map();
    }

    insert(
        key: string,
        value: any,
        {
            postfix = '',
            at,
            hash = '',
        }: {
            postfix?: string;
            at?: {name: string; query: string};
            hash?: string;
        },
    ) {
        hash = hash ? '-' + hash : '';
        const {nameGenerator} = config;

        const cssKey = camelToKebab(key);

        const name = nameGenerator.getName(cssKey, value, {
            postfix,
            at,
        });

        const result = Object.create(null);
        // result[propHash + postfixHash] = value + hash
        result[name[0] + name[1] + name[2]] = name[3] + hash;

        const nameHash = name.join('');

        if (this.cache.has(nameHash)) {
            return result;
        }

        const atHash = at ? at.name + at.query : '';
        let atRuleIndex = this.rulesCache.get(atHash);

        if (at && atRuleIndex === undefined) {
            atRuleIndex = this.insertAtRule(at);
            this.rulesCache.set(atHash, atRuleIndex);
        }

        const originalName = nameGenerator.getName(cssKey, value, {at});
        const originalHash = originalName.join('');

        let ruleIndex;

        const className = `${nameHash}${hash}${postfix}`;

        if (this.rulesCache.has(originalHash)) {
            ruleIndex = this.rulesCache.get(originalHash);

            this.appendSelector(ruleIndex, `.${className}`, {atRuleIndex});
        }

        if (ruleIndex === undefined) {
            ruleIndex = this.insertAtomicRule(className, cssKey, value, {
                postfix,
                atRuleIndex,
            });
        }

        this.cache.set(nameHash, {name, key, value, postfix, at, ruleIndex});

        if (
            this.options.mergeDeclarations &&
            ruleIndex !== undefined &&
            ruleIndex >= 0
        ) {
            this.rulesCache.set(originalHash, ruleIndex);
        }

        return result;
    }
}

export default Sheet;
