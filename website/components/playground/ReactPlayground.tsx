import Head from 'next/head';

import * as React from 'react';

import {css} from 'taddy';

import {row, column, Row} from '../layout';

import {LiveEditor} from './LiveEditor';
import {Options} from './Options';
import {ReactRender} from './ReactRender';

import {useAction} from '@reatom/react';
import {playgroundAtom, updatePlayground} from './atoms';

export default function Playground() {
    // const updateOptions = useAction((options) => {
    //     return updatePlayground({
    //         options,
    //     });
    // });
    // React.useEffect(() => {
    //     updateOptions({
    //         format: false,
    //         presets: ['@babel/react', '@babel/typescript'],
    //         plugins: [
    //             [
    //                 '@babel/plugin-transform-modules-commonjs',
    //                 {noInterop: true, loose: true},
    //             ],
    //         ],
    //     });
    // }, []);

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

                    <ReactRender />
                </Row>
            </div>
        </div>
    );
}
