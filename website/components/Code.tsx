import React from 'react';
import LZString from 'lz-string';
import history from './history';
import {stripIndent} from 'common-tags';

const initialCode = `
    import {css} from 'taddy'

    const COLORS = {
        primary: 'red',
        secondary: 'blue'
    } as const

    export default css({
        color: COLORS.secondary,
        backgroundColor: COLORS.primary,
    })
`;

const INITIAL_CODE = stripIndent(initialCode);
const NEWLINE = '❤';

export const encode = (value) =>
    LZString.compressToEncodedURIComponent(
        value.replace(/\n/g, NEWLINE).replace(/\s/g, ' '),
    );
export const decode = (value) =>
    value !== INITIAL_CODE
        ? LZString.decompressFromEncodedURIComponent(value).replace(
              new RegExp(NEWLINE, 'g'),
              '\n',
          )
        : INITIAL_CODE;

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
            query: {
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

export const code = new CodeHandler(
    history.location.query.code || INITIAL_CODE,
);

const Code = ({children}) => {
    React.useEffect(() => {
        window.addEventListener('blur', code.updateCodeLink);

        return () => {
            window.removeEventListener('blur', code.updateCodeLink);
        };
    }, []);

    return null;
};

export default Code;
