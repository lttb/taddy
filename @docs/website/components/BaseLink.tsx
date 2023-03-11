import React from 'react';

import NextLink from 'next/link';
import {useRouter} from 'next/router';

export const Link = ({href, ...props}) => {
    const router = useRouter();
    const currentPage = router.pathname === href;
    return (
        <NextLink href={href}>
            <a aria-current={currentPage ? 'page' : false} {...props} />
        </NextLink>
    );
};
