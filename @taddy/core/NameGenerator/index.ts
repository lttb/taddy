import {isInvalidValue} from '../common';

function hash(s: string) {
    let h = 0;
    for (let i = 0; i < s.length; i++)
        h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;

    return h.toString(36);
}

type NameOptions = {
    postfix?: string;
    at?: {query: string; name: string};
};

function generateHash(value: string) {
    // if (__DEV__) {
    //     const cssesc = require('cssesc');
    //     return cssesc(value, {isIdentifier: true}).replace(/\s/g, '-');
    // }

    return hash(String(value));
}

export class NameGenerator {
    cache: {[name: string]: string} = {};

    getHash = (value?: string): string => {
        if (isInvalidValue(value)) return '';
        if (value[0] === '_') return value;

        const key = `_${value}`;

        if (!(key in this.cache)) {
            this.cache[key] = generateHash(value);
        }

        return `_${this.cache[key]}`;
    };

    getName = (
        prop: string,
        value: string,
        {postfix = '', at}: NameOptions = {},
    ) => {
        return [
            this.getHash(at?.name),
            this.getHash(at?.query),
            this.getHash(postfix),
            this.getHash(prop),
            this.getHash(value),
        ] as const;
    };
}
