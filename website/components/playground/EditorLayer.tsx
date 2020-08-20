import * as React from 'react';

import {css} from 'taddy';

const styles = {
    base: css({
        transitionProperty: 'opacity',
        transitionDuration: '300ms',
        position: 'absolute',
        opacity: 0,
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        whiteSpace: 'pre',
        zIndex: 5,
        padding: '20px',
        fontSize: '17px',
        fontFamily: 'monospace',
        fontWeight: 'bold',
    }),
    _variant: {
        compiling: css({
            opacity: 1,
            background: 'rgb(255 255 255 / 95%)',
            textAlign: 'center',
            color: 'black',
        }),
        error: css({
            opacity: 1,
            background: 'rgb(2 10 10 / 80%)',
            textAlign: 'left',
            color: 'white',
        }),
    },
};

export const EditorLayer = ({
    children,
    variant,
}: {
    children: React.ReactNode;
    variant: keyof typeof styles._variant;
}) => {
    return (
        <code {...css(styles.base, styles._variant[variant])}>{children}</code>
    );
};
