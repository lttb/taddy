// @ts-ignore
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
};

export class NameGenerator {
    cache: {[name: string]: string} = {};

    getHash = (value?: string): string => {
        if (isInvalidValue(value)) return '';
        if (value[0] === '_') return value;

        const key = `_${value}`;

        if (!(key in this.cache)) {
            this.cache[key] = hash.digest(String(value));
        }

        return `_${this.cache[key]}`;
    };

    getPropHash = (prop: string): string => {
        return this.getHash(prop);
    };

    getPostfixHash = (postfix?: string): string => {
        return this.getHash(postfix);
    };

    getValueHash = (value: string): string => {
        return this.getHash(value);
    };

    getName = (
        prop: string,
        value: string,
        {postfix = ''}: NameOptions = {},
    ): string[] => {
        return [this.getHash(postfix), this.getHash(prop), this.getHash(value)];
    };
}
