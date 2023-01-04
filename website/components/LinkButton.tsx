import * as React from 'react';
import {css} from 'taddy';

import {Link} from './BaseLink';

const styles = {
    _variant: {
        normal: css({
            color: 'violet',
            background: 'none',
        }),
        action: css({
            color: 'white',
            background: 'violet',
        }),
        pseudo: css({
            color: 'violet',
            borderColor: 'transparent',
        }),
    },
};

export const LinkButton = ({
    href,
    variant = 'normal',
    className,
    style,
    children,
}: {
    href: string;
    variant?: string;
    style?: object;
    className?: string;
    children: React.ReactNode;
}) => {
    return (
        <Link
            href={href}
            {...css(styles._variant[variant], {
                padding: '10px 20px',
                borderRadius: '12px',
                borderWidth: '2px',
                borderStyle: 'solid',
                fontWeight: 'bold',
                fontSize: '18px',
                width: '200px',
                textAlign: 'center',
                className,
                style,
            })}
        >
            {children}
        </Link>
    );
};
