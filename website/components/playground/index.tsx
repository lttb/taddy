import Head from 'next/head';

import * as React from 'react';

import {css} from 'taddy';

import {row, column, Row} from '../layout';

import {LiveEditor} from './LiveEditor';
import {Options} from './Options';
import {CompiledCode} from './CompiledCode';

export default function Playground() {
    return (
        <div>
            <Head>
                <script
                    async
                    src="https://unpkg.com/typescript@latest/lib/typescriptServices.js"
                ></script>
            </Head>

            <div {...css(column({gap: 4}))}>
                <Options />

                <Row {...css(row({gap: 4}))}>
                    <LiveEditor />

                    <CompiledCode />
                </Row>
            </div>
        </div>
    );
}
