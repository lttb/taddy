import React from 'react';
import LZString from 'lz-string';
import history from './history';
import {stripIndent} from 'common-tags';

const initialCode = `
import React from 'react'
import {css} from 'taddy'

const COLORS = {
    primary: 'red',
    secondary: 'blue',
} as const

type Props = {children: string; variant: keyof typeof COLORS}

export function Title({variant, children}: Props) {
    return (
        <h1 {...css({
            /* declare your styles here */

            color: COLORS[variant],

            ...typo({size: 's'}),
        })}>
            {children}
        </h1>
    )
}

function typo({size = 's', weight = 'normal'}) {
    return css.mixin({
        weight,
        lineHeight: 1.2,

        ...size === 's' && {
            fontSize: '14px',
        },

        ...size === 'm' && {
            fontSize: '16px',
        }
    })
}
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
