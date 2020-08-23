import dynamic from 'next/dynamic';

import {css} from 'taddy';

import {column} from '../../components/layout';

const Playground = dynamic(() => import('../../components/playground'), {
    ssr: false,
    loading: () => <p {...css({textAlign: 'center'})}>loading ...</p>,
});

export default function PlaygroundPage() {
    return (
        <div {...css(column({gap: 4}))}>
            <div
                {...css({
                    background: 'white',
                    padding: '20px',
                    minHeight: '100vh',
                    width: '100%',
                })}
            >
                <Playground />
            </div>
        </div>
    );
}
