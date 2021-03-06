import React from 'react';
import LZString from 'lz-string';
import history from './history';

const NEWLINE = '❤';

export const encode = (value) =>
    LZString.compressToEncodedURIComponent(
        value.replace(/\n/g, NEWLINE).replace(/\s/g, ' '),
    );
export const decode = (value) =>
    LZString.decompressFromEncodedURIComponent(value).replace(
        new RegExp(NEWLINE, 'g'),
        '\n',
    );

class CodeHandler {
    value: string;
    timerId: any;

    constructor(initial) {
        this.value = decode(initial);
    }

    getHash = () => {
        return encode(this.value);
    };

    onChange = (code) => {
        this.value = code;
    };

    updateCodeLink = () => {
        if (!this.value) return;

        history.replace({
            pathname: globalThis.location.pathname,
            query: {
                ...history.location.query,
                code: this.getHash(),
            },
        });
    };

    scheduleLinkUpdate(timeout = 1000) {
        if (this.timerId) {
            clearTimeout(this.timerId);
        }

        this.timerId = setTimeout(this.updateCodeLink, timeout);
    }
}

export const code = new CodeHandler(history.location.query.code);

export const useCode = (value?: string | null): string => {
    React.useEffect(() => {
        if (value === null) return;

        code.onChange(value);

        code.scheduleLinkUpdate();
    }, [value]);

    /**
     * Code will subscribe only if there is an initial code
     */
    React.useEffect(() => {
        if (value === null) return;

        window.addEventListener('blur', code.updateCodeLink);

        return () => {
            window.removeEventListener('blur', code.updateCodeLink);
        };
    }, []);

    return code.value;
};
