import React from 'react';

import {css} from 'taddy';

import {Column} from './layout';
import {Link} from './Link';

const bearWhite = require('../public/logo/taddy2.png');

export const Sidebar = () => {
    return (
        <Column
            gap={10}
            inline
            {...css(
                {
                    // background: 'rgb(38 78 156)',
                    background: '#1f39a4',
                    padding: '20px',
                    width: '300px',
                    color: 'white',
                    fontSize: '20px',
                    position: 'sticky',
                    top: 0,
                    minHeight: '100vh',
                    height: '100%',
                },
                {
                    fontFamily: 'monospace',
                    ' a[aria-current="page"]': {
                        color: 'violet',
                    },
                    ' a:hover': {
                        color: 'violet',
                    },
                },
            )}
        >
            <Link
                {...css({
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                })}
                href="/"
            >
                <img alt="taddy sidebar logo" src={bearWhite} height={100} />

                <p {...css({margin: 0, fontWeight: 'bold', fontSize: '30px'})}>
                    taddy
                </p>
            </Link>

            <Column as="ul" gap={5} inline>
                <li>
                    <Link href="https://github.com/lttb/taddy">github</Link>
                </li>
                <li>
                    <Link href="/playground">playground</Link>
                </li>

                {/* <li>
                    <Link href="/intro">introduction</Link>

                    <ul>
                        <li>
                            <Link href="/intro/get-started">about</Link>
                        </li>
                        <li>
                            <Link href="/intro/get-started">get started</Link>
                        </li>
                        <li>
                            <Link href="/intro/get-started">concept</Link>
                        </li>
                    </ul>
                </li>
                <li>
                    <Link href="/docs">documentation</Link>
                </li> */}
            </Column>
        </Column>
    );
};
