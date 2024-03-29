import * as React from 'react';

import {css} from 'taddy';

const size = (v: number) => `${v * 4}px`;
const margin = (gapY: number, gapX: number) =>
    `${size(gapY / 2)} ${size(gapX / 2)}`;

function flex({inline}) {
    return css({
        display: inline ? 'inline-flex' : 'flex',

        ...(!inline && {
            flex: 1,
            maxWidth: '100%',

            '> *': {
                flex: 1,
                maxWidth: '100%',
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
}: {
    gap?: Size;
    gapY?: Size;
    gapX?: Size;
    inline?: boolean;
    wrap?: any;
} = {}) {
    return css({
        ...flex({inline}),

        flexDirection: 'row',

        margin: margin(-gapY, -gapX),

        ...(!inline && {
            width: `calc(100% + ${size(gapX)})`,
        }),

        '> *:not(:empty)': {
            display: 'flex',
            margin: margin(gapY, gapX),
        },
    });
}

export function column({
    gap = 0,
    inline = false,
}: {gap?: Size; gapY?: Size; gapX?: Size; inline?: boolean} = {}) {
    return css({
        ...flex({inline}),

        flexDirection: 'column',

        '> *:not(:empty) + *:not(:empty)': {
            display: 'flex',
            marginTop: size(gap),
        },
    });
}

function shouldWrap(child) {
    return !(child == undefined || !!child.type.__unit__);
}

function wrapChildren(children) {
    return React.Children.map(children, (child) =>
        shouldWrap(child) ? <div>{child}</div> : child,
    );
}

export const Column = ({
    as: Tag = 'div',
    gap,
    inline,
    style,
    className,
    children,
    ...props
}: Partial<{
    as: keyof JSX.IntrinsicElements;
    gap: Size;
    inline: boolean;
    className?: string;
    style?: object;
    children: React.ReactNode;
}>) => (
    <Tag {...props} {...css(column({gap, inline}), {style, className})}>
        {wrapChildren(children)}
    </Tag>
);

export const Row = ({
    as: Tag = 'div',
    gap = 0,
    gapY = gap,
    gapX = gap,
    inline = false,
    style,
    className,
    children,
    ...props
}: Partial<{
    as: keyof JSX.IntrinsicElements;
    gap: Size;
    gapY: Size;
    gapX: Size;
    inline: boolean;
    className?: string;
    style?: object;
    children: React.ReactNode;
    wrap?: string;
}>) => (
    <div
        {...css(flex({inline}), {
            flexWrap: 'wrap',
            justifyContent: 'initial',
            alignItems: 'initial',
            alignContent: 'initial',

            style,
            className,
        })}
    >
        <Tag
            {...props}
            {...css(row({gapX, gapY, inline}), {
                flexWrap: 'inherit',
                justifyContent: 'inherit',
                alignItems: 'inherit',
                alignContent: 'inherit',
            })}
        >
            {wrapChildren(children)}
        </Tag>
    </div>
);
