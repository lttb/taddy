import {config} from '@taddy/core';

import {camelToKebab} from './common';

export type SheetOptions = {
    mergeDeclarations?: boolean;
};

abstract class Sheet {
    options: SheetOptions;
    cache: Map<string, any>;
    rulesCache: Map<string, any>;

    abstract insertAtomicRule(
        className: string,
        key: string,
        value: string,
        options: {postfix?: string},
    ): number;

    abstract appendSelector(ruleIndex: number, selector: string): void;

    constructor(options: SheetOptions = {}) {
        this.options = Object.assign({mergeDeclarations: true}, options);

        this.cache = new Map();
        this.rulesCache = new Map();
    }

    insert(key: string, value: any, {postfix = ''}: {postfix?: string}) {
        const {nameGenerator} = config;

        const cssKey = camelToKebab(key);

        const name = nameGenerator.getName(cssKey, value, {
            postfix,
        });

        const result = Object.create(null);
        // result[propHash + postfixHash] = value
        result[name[0] + name[1]] = name[2];

        const nameHash = name.join('');

        if (this.cache.has(nameHash)) {
            return result;
        }

        const originalName = nameGenerator.getName(cssKey, value);
        const originalHash = originalName.join('');

        let ruleIndex;

        const className = `${nameHash}${postfix}`;

        if (this.rulesCache.has(originalHash)) {
            ruleIndex = this.rulesCache.get(originalHash);
            this.appendSelector(ruleIndex, `.${className}`);
        }

        if (ruleIndex === undefined) {
            ruleIndex = this.insertAtomicRule(className, cssKey, value, {
                postfix,
            });
        }

        this.cache.set(nameHash, {name, key, value, postfix, ruleIndex});

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
