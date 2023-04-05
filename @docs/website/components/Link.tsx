import * as React from 'react';
import {css} from 'taddy';

import {Link as BaseLink} from './BaseLink';

export const Link = ({
    href,
    className,
    style,
    children,
}: {
    href: string;
    style?: object;
    className?: string;
    children: React.ReactNode;
}) => {
    return (
        <BaseLink
            href={href}
            {...css({
                color: '#4169e1',
                ':hover': {
                    color: 'violet',
                },
                className,
                style,
            })}
        >
            {children}
        </BaseLink>
    );
};
