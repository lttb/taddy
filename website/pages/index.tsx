import Head from 'next/head';
import {css, $} from 'taddy';

import {Link} from '../components/Link';
import {Row, Column} from '../components/layout';
import {LinkButton} from '../components/LinkButton';

const Logo1 = require('../public/logo/taddy1.png');
const Logo11 = require('../public/logo/taddy11.png');

const Logos = () => {
    const transition = css.mixin({
        transitionProperty: 'opacity',
        transitionDuration: '500ms',
    });

    const second = css({
        ...transition,

        position: 'absolute',
        width: '100%',
        height: '100%',
        top: '0',
        left: '0',
        opacity: '0',

        zIndex: -1,
    });
    const first = css({
        ...transition,

        zIndex: 1,
    });

    return (
        <Link
            href="/"
            {...css({
                ':hover': {
                    [$` ${first}`]: {
                        opacity: 0,
                    },
                    // opacity: '0',
                    [$` ${second}`]: {
                        opacity: 1,
                    },
                },
            })}
        >
            <div
                {...css({
                    display: 'flex',
                    position: 'relative',
                })}
            >
                <img {...first} height="300" alt="taddy logo" src={Logo1} />

                <img {...second} height="300" alt="taddy logo" src={Logo11} />
            </div>

            <h1
                {...css({
                    color: '#3e68ba',
                    textAlign: 'center',
                })}
            >
                taddy
            </h1>
        </Link>
    );
};

export default function Home() {
    return (
        <>
            <Head>
                <title>taddy | Compile-time Atomic CSS-in-JS library</title>
            </Head>

            <Column
                gap={5}
                inline
                {...css({
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignContent: 'center',
                    minHeight: '80vh',
                    padding: '20px',
                    textAlign: 'center',
                })}
            >
                <Logos />

                <h2>Compile&#8209;time Atomic CSS&#8209;in&#8209;JS</h2>

                <Row
                    gap={4}
                    inline
                    {...css({
                        justifyContent: 'center',
                    })}
                >
                    <LinkButton
                        {...css({fontSize: '24px'})}
                        variant="action"
                        href="https://github.com/lttb/taddy"
                    >
                        Get Started
                    </LinkButton>

                    <LinkButton {...css({fontSize: '24px'})} href="/playground">
                        Playground
                    </LinkButton>
                </Row>
            </Column>
        </>
    );
}
