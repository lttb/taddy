import React from 'react';

import {css} from 'taddy';

import {column} from './layout';
import {Link} from './Link';

const BearWhite = require('../public/logo/taddy2.svg?sprite');

export const Sidebar = () => {
    return (
        <div
            {...css(
                column({
                    gap: 10,
                    inline: true,
                }),
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
                <BearWhite width={100} height={100} />

                <p {...css({margin: 0, fontWeight: 'bold', fontSize: '30px'})}>
                    taddy
                </p>
            </Link>

            <ul
                {...css(
                    column({
                        gap: 5,
                        inline: true,
                    }),
                )}
            >
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
            </ul>
        </div>
    );
};
