import {css} from 'taddy';
import Link from 'next/link';

const LinkButton = ({href, children}) => (
    <Link href={href}>
        <a
            {...css({
                padding: '8px 10px',
                borderRadius: '4px',
                borderWidth: '2px',
                borderStyle: 'solid',
                color: 'violet',
            })}
        >
            {children}
        </a>
    </Link>
);

export default function Home() {
    return (
        <div>
            <LinkButton href="/playground">Try Playground</LinkButton>
        </div>
    );
}
