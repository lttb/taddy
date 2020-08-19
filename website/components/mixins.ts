import {$, css} from 'taddy';

const size = (v: number) => `${v * 4}px`;

export const row = ({gap = 0, gapY = gap, gapX = gap, inline = false} = {}) =>
    css.mixin({
        display: 'flex',
        flexDirection: 'row',
        flexGrow: 1,

        margin: `${size(-gapY / 2)} ${size(-gapX / 2)}`,

        [$`> *:not(:empty)`]: {
            margin: `${size(gapY / 2)} ${size(gapX / 2)}`,
        },

        ...(!inline && {
            [$`> *`]: {
                flexGrow: 1,
            },
        }),
    });

export const column = ({gap = 0, inline = false} = {}) =>
    css.mixin({
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,

        [$`> *:not(:empty) + *:not(:empty)`]: {
            marginTop: size(gap),
        },

        ...(!inline && {
            [$`> *`]: {
                flexGrow: 1,
            },
        }),
    });
