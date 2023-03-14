import hash from 'custom-hash';

import {isInvalidValue} from '../common';

const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';

hash.configure({
    charSet: alphabet,
    maxLength: 4,
    right: true,
});

type NameOptions = {
    postfix?: string;
    at?: {query: string; name: string};
};

function generateHash(value: string) {
    // if (__DEV__) {
    //     const cssesc = require('cssesc');
    //     return cssesc(value, {isIdentifier: true}).replace(/\s/g, '-');
    // }

    return hash.digest(String(value));
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
    ): string[] => {
        return [
            this.getHash(at?.name),
            this.getHash(at?.name),
            this.getHash(postfix),
            this.getHash(prop),
            this.getHash(value),
        ];
    };
}
