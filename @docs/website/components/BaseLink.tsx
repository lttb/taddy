import type {PropsWithChildren, CSSProperties} from 'react';

import NextLink from 'next/link';
import {useRouter} from 'next/router';

export const Link = ({
    href,
    ...props
}: PropsWithChildren<{
    href: string;
    style?: CSSProperties;
    className?: string;
}>) => {
    const router = useRouter();
    const currentPage = router.pathname === href;
    return (
        <NextLink
            href={href}
            aria-current={currentPage ? 'page' : false}
            {...props}
        />
    );
};
