import {config} from '@taddy/core';

import {camelToKebab} from './common';

export type SheetOptions = {
    mergeDeclarations?: boolean;
};

abstract class Sheet {
    options: SheetOptions;
    cache: Map<string, any>;
    rulesCache: Map<string, any>;

    abstract insertMedia(media: string): number;

    abstract insertAtomicRule(
        className: string,
        key: string,
        value: string,
        options: {postfix?: string; mediaIndex?: number},
    ): number;

    abstract appendSelector(
        ruleIndex: number,
        selector: string,
        options?: {mediaIndex?: number},
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
            media = '',
            hash = '',
        }: {postfix?: string; media?: string; hash?: string},
    ) {
        hash = hash ? '-' + hash : '';
        const {nameGenerator} = config;

        const cssKey = camelToKebab(key);

        const name = nameGenerator.getName(cssKey, value, {
            postfix,
            media,
        });

        const result = Object.create(null);
        // result[propHash + postfixHash] = value + hash
        result[name[0] + name[1] + name[2]] = name[3] + hash;

        const nameHash = name.join('');

        if (this.cache.has(nameHash)) {
            return result;
        }

        let mediaIndex = this.rulesCache.get(media);

        if (media && mediaIndex === undefined) {
            mediaIndex = this.insertMedia(media);
            this.rulesCache.set(media, mediaIndex);
        }

        const originalName = nameGenerator.getName(cssKey, value, {media});
        const originalHash = originalName.join('');

        let ruleIndex;

        const className = `${nameHash}${hash}${postfix}`;

        if (this.rulesCache.has(originalHash)) {
            ruleIndex = this.rulesCache.get(originalHash);

            this.appendSelector(ruleIndex, `.${className}`, {mediaIndex});
        }

        if (ruleIndex === undefined) {
            ruleIndex = this.insertAtomicRule(className, cssKey, value, {
                postfix,
                mediaIndex,
            });
        }

        this.cache.set(nameHash, {name, key, value, postfix, media, ruleIndex});

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
