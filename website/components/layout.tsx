import * as React from 'react';

import {$, css} from 'taddy';

const size = (v: number) => `${v * 4}px`;

export const row = ({gap = 0, gapY = gap, gapX = gap, inline = false} = {}) =>
    css.mixin({
        display: 'flex',
        flexDirection: 'row',

        margin: `${size(-gapY / 2)} ${size(-gapX / 2)}`,

        [$`> *:not(:empty)`]: {
            margin: `${size(gapY / 2)} ${size(gapX / 2)}`,
        },

        ...(!inline && {
            flex: '1',
            width: `calc(100% + ${size(gapX)})`,

            [$`> *`]: {
                flex: '1',
            },
        }),
    });

export const column = ({gap = 0, inline = false} = {}) =>
    css.mixin({
        display: 'flex',
        flexDirection: 'column',

        [$`> *:not(:empty) + *:not(:empty)`]: {
            marginTop: size(gap),
        },

        ...(!inline && {
            flex: '1',

            [$`> *`]: {
                flex: '1',
            },
        }),
    });

export const Row = (props) => <div {...props} />;
