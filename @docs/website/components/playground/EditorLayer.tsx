import * as React from 'react';

import {css} from 'taddy';

const styles = {
    base: css({
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        whiteSpace: 'pre',
        zIndex: 5,
        padding: '20px',
        fontSize: '14px',
        overflowX: 'scroll',
        fontFamily: 'monospace',
        fontWeight: 'bold',
        textAlign: 'left',
    }),
    _variant: {
        compiling: css({
            background: 'rgba(255 255 255 / 95%)',
            color: 'black',
        }),
        error: css({
            background: 'rgba(2 10 10 / 80%)',
            color: 'white',
        }),
    },
    _animated: css({
        transitionProperty: 'opacity',
        transitionDuration: '150ms',
    }),
    _hidden: css({opacity: 0, zIndex: -1}),
};

export const EditorLayer = ({
    children,
    variant,
    className,
}: {
    children?: React.ReactNode;
    variant?: keyof typeof styles._variant;
    className?: string;
}) => {
    return (
        <code
            {...css(
                {className},
                styles.base,
                styles._animated,
                variant ? styles._variant[variant] : styles._hidden,
            )}
        >
            {children}
        </code>
    );
};
