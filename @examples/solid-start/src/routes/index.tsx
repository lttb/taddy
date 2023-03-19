import {Title} from 'solid-start';

import Hello from '../components/Hello';
import Counter from '../components/Counter';

export default function Home() {
    return (
        <main>
            <Title>Hello World</Title>
            <Hello />
            <Counter />
            <p>
                Visit{' '}
                <a
                    href="https://start.solidjs.com"
                    target="_blank"
                    rel="noreferrer"
                >
                    start.solidjs.com
                </a>{' '}
                to learn how to build SolidStart apps.
            </p>
        </main>
    );
}
