import {css} from 'taddy';

import {Link} from '@docs/website/components/BaseLink';
import {Row, Column} from '@docs/website/components/layout';
import {LinkButton} from '@docs/website/components/LinkButton';

import logo1Image from '@docs/website/public/logo/taddy1.png';
import logo11Image from '@docs/website/public/logo/taddy11.png';

export default function Home() {
    return (
        <Column
            gap={5}
            inline
            {...css({
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                alignContent: 'center',
                minHeight: '80vh',
                textAlign: 'center',
            })}
        >
            <Logos />

            <div>
                {/* <marquee
                    scrollamount="2"
                    behavior="alternate"
                    direction="up"
                    height="50"
                > */}
                <h2
                    {...css({
                        fontWeight: 400,
                        margin: 0,
                        textAlign: 'center',
                    })}
                >
                    Compile&#8209;time Atomic CSS&#8209;in&#8209;JS
                </h2>
                {/* </marquee> */}
            </div>

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
    );
}

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
        top: 0,
        left: 0,
        opacity: 0,
    });
    const first = css({
        ...transition,
    });

    return (
        <Link
            href="/"
            {...css({
                ':hover': {
                    [` ${first}`]: {
                        opacity: 0,
                    },
                    // opacity: '0',
                    [` ${second}`]: {
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
                <img
                    {...first}
                    height="300"
                    alt="taddy logo"
                    src={logo1Image.src}
                />

                <img
                    {...second}
                    height="300"
                    alt="taddy logo"
                    src={logo11Image.src}
                />
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
