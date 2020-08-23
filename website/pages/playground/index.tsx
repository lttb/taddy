import Head from 'next/head';
import dynamic from 'next/dynamic';

import {css} from 'taddy';
import {stripIndent} from 'common-tags';

import {Column} from '../../components/layout';

const Playground = dynamic(() => import('../../components/playground'), {
    ssr: false,
    loading: () => <p {...css({textAlign: 'center'})}>loading ...</p>,
});

export default function PlaygroundPage() {
    return (
        <>
            <Head>
                <title>taddy | Playground</title>
            </Head>

            <Column gap={4}>
                <div
                    {...css({
                        background: 'white',
                        padding: '20px',
                        minHeight: '100vh',
                        width: '100%',
                    })}
                >
                    <Playground
                        persistent
                        showOptions
                        showCompiledCode
                        showRender
                        showCompiledCSS
                        initialCode={`
                        import React from 'react';
                        import {css} from 'taddy';

                        export default (
                            <h1 {...css({color: 'violet', margin: 0})}>
                                Hello, world!
                            </h1>
                        )
                    `}
                    />
                </div>
            </Column>
        </>
    );
}
