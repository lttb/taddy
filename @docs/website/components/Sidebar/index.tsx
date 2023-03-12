import React from 'react';

import {css} from 'taddy';

import {COLORS} from '@docs/website/styles';

import {Column} from '../layout';
import {Link} from '../BaseLink';

import styles from './styles.module.css';

import bearImage from '@docs/website/public/logo/taddy9.png';

const Burger = () => (
    <div className={styles.burger}>
        <span />
        <span />
        <span />
    </div>
);

export const Sidebar = () => {
    return (
        <div className={styles.sidebar}>
            <input className={styles.input} type="checkbox" />

            <Burger />

            <Column
                gap={10}
                inline
                {...css({
                    className: styles.menu,
                    // background: 'rgb(38 78 156)',
                    // background: COLORS.base1,
                    background: '#f3f0f3',
                    padding: '20px',
                    width: '300px',
                    color: 'black',
                    fontSize: '20px',
                    position: 'sticky',
                    top: 0,
                    minHeight: '100vh',
                    height: '100%',

                    fontFamily: 'monospace',
                    ' a[aria-current="page"]': {
                        color: 'violet',
                    },
                    ' a:hover': {
                        color: 'violet',
                    },
                })}
            >
                <Link
                    {...css({
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column',
                    })}
                    href="/"
                >
                    <img
                        alt="taddy sidebar logo"
                        src={bearImage.src}
                        height={100}
                        {...css({
                            filter: 'invert(37%) sepia(40%) saturate(1401%) hue-rotate(188deg) brightness(89%) contrast(82%)',
                        })}
                    />

                    <p
                        {...css({
                            margin: 0,
                            fontWeight: 'bold',
                            fontSize: '30px',
                            color: '#3e68ba',
                        })}
                    >
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

                    <li>
                        <Link href="/roadmap">roadmap</Link>
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
        </div>
    );
};
