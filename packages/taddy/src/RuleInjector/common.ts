import {config, isInvalidValue} from '@taddy/core';

export function buildAtomicRule(
    selector: string,
    key: string,
    value: string,
): string {
    return `${selector}{${key}:${value}}`;
}

const camelToKebabRe = /([a-z0-9]|(?=[A-Z]))([A-Z])/g;
export function camelToKebab(string): string {
    return string.replace(camelToKebabRe, '$1-$2').toLowerCase();
}

export function getStyleNodeById(id: string): HTMLStyleElement {
    let node = document.getElementById(id) as HTMLStyleElement;
    if (!node) {
        node = document.createElement('style');
        node.id = id;
        document.head.appendChild(node);
    }
    return node;
}

export abstract class Sheet {
    cache: Map<string, any>;
    rulesCache: Map<string, any>;

    abstract insertAtomicRule(
        className: string,
        key: string,
        value: string,
        options: {postfix?: string},
    ): number;

    abstract appendSelector(ruleIndex: number, selector: string): void;

    constructor() {
        this.cache = new Map();

        this.rulesCache = new Map();
    }

    insert(
        key: string,
        value: any,
        {postfix = '', inject = true}: {postfix?: string; inject?: boolean},
    ) {
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

        if (ruleIndex === undefined && inject) {
            ruleIndex = this.insertAtomicRule(className, cssKey, value, {
                postfix,
            });
        }

        this.cache.set(nameHash, {name, key, value, postfix, ruleIndex});

        if (ruleIndex !== undefined && ruleIndex >= 0) {
            this.rulesCache.set(originalHash, ruleIndex);
        }

        return result;
    }
}
