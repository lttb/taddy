import dynamic from 'next/dynamic';

import {css} from 'taddy';

import {Column} from '@/components/layout';

const Playground = dynamic(() => import('@/components/playground'), {
    ssr: false,
    loading: () => <p {...css({textAlign: 'center'})}>loading ...</p>,
});

export default function PlaygroundPage() {
    return (
        <Column gap={4}>
            <div
                {...css({
                    background: 'white',
                    minHeight: '100vh',
                    width: '100%',
                })}
            >
                <h1>Playground</h1>

                <Playground
                    persistent
                    showOptions
                    showCompiledCode
                    showRender
                    showCompiledCSS
                    initialCode={`
                            import React from 'react';
                            import {css} from 'taddy';

                            const color = 'violet'

                            export default (
                                <h1 {...css({color, margin: 0})}>
                                    Hello, world!
                                </h1>
                            )
                        `}
                />
            </div>
        </Column>
    );
}
