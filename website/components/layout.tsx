import * as React from 'react';

import {$, css} from 'taddy';

const size = (v: number) => `${v * 4}px`;
const margin = (gapY: number, gapX: number) =>
    `${size(gapY / 2)} ${size(gapX / 2)}`;

function flex({inline}) {
    return css.mixin({
        display: 'flex',

        ...(!inline && {
            flexGrow: 1,

            [$`> *`]: {
                flexGrow: 1,
            },
        }),
    });
}

type Size = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export function row({
    gap = 0,
    gapY = gap,
    gapX = gap,
    inline = false,
    wrap = 'wrap',
}: {
    gap?: Size;
    gapY?: Size;
    gapX?: Size;
    inline?: boolean;
    wrap?: any;
} = {}) {
    return css.mixin({
        ...flex({inline}),

        flexDirection: 'row',
        flexWrap: wrap,

        margin: margin(-gapY, -gapX),

        ...(!inline && {
            width: `calc(100% + ${size(gapX)})`,
        }),

        '> *:not(:empty)': {
            margin: margin(gapY, gapX),
        },
    });
}

export function column({
    gap = 0,
    inline = false,
}: {gap?: Size; gapY?: Size; gapX?: Size; inline?: boolean} = {}) {
    return css.mixin({
        ...flex({inline}),

        flexDirection: 'column',

        '> *:not(:empty) + *:not(:empty)': {
            marginTop: size(gap),
        },
    });
}

export const Row = (props) => (
    <div>
        <div {...props} />
    </div>
);
