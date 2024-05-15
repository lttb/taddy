import Head from 'next/head';

import { css } from 'taddy';

import { Column, Row } from '../layout';

import { LiveEditor } from './LiveEditor';
import { Options } from './Options';
import { CompiledCode } from './CompiledCode';

import { createStore } from '@reatom/core';
import { context } from '@reatom/react';

export default function Playground({
    initialCode,
    showOptions,
    showCompiledCode,
    showCompiledCSS,
    showRender,
    persistent,
    useTest
}: {
    initialCode?: string;
    showOptions?: boolean;
    showCompiledCode?: boolean;
    showCompiledCSS?: boolean;
    showRender?: boolean;
    persistent?: boolean;
    useTest?: boolean
}) {
    const store = createStore();

    return (
        <context.Provider value={store}>
            <div>
                <Head>
                    <script
                        async
                        src="https://unpkg.com/typescript@latest/lib/typescript.js"
                    ></script>
                </Head>

                <Column gap={4} {...css({ background: 'white' })}>
                    {showOptions && <Options />}

                    <Row gap={4}>
                        <LiveEditor
                            persistent={persistent}
                            initialCode={initialCode}
                        />

                        <CompiledCode
                            {...{ showCompiledCode, showCompiledCSS, showRender, useTest }}
                        />
                    </Row>
                </Column>
            </div>
        </context.Provider>
    );
}
