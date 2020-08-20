import {css, $} from 'taddy';
import Link from 'next/link';

import {row, column, Row} from '../components/layout';

const LinkButton = ({href, children}) => (
    <Link href={href}>
        <a
            {...css({
                padding: '10px 20px',
                borderRadius: '12px',
                borderWidth: '2px',
                borderStyle: 'solid',
                color: 'violet',
                fontWeight: 'bold',
                fontSize: '20px',
            })}
        >
            {children}
        </a>
    </Link>
);

const Logo = () => {
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
        ':hover': {
            opacity: '0',
            [$`+ ${second}`]: {
                opacity: 1,
            },
        },
    });

    return (
        <Link href="/">
            <a {...css({display: 'flex', position: 'relative'})}>
                <img
                    {...first}
                    height="300"
                    alt="taddy logo"
                    src="https://github.com/lttb/taddy/raw/main/docs/logo/taddy1.png?raw=true"
                />

                <img
                    {...second}
                    height="300"
                    alt="taddy logo"
                    src="https://github.com/lttb/taddy/raw/main/docs/logo/taddy11.png?raw=true"
                />
            </a>
        </Link>
    );
};

export default function Home() {
    return (
        <div
            {...css({
                ...column({gap: 10}),

                alignItems: 'center',
                justifyContent: 'center',
            })}
        >
            <span>
                <Logo />
            </span>

            <h2>Compile-time Atomic CSS-in-JS</h2>

            <div>
                <Row {...css(row({gap: 4, inline: true}))}>
                    <LinkButton href="https://github.com/lttb/taddy">
                        Github
                    </LinkButton>

                    <LinkButton href="/playground">Try Playground</LinkButton>
                </Row>
            </div>
        </div>
    );
}
