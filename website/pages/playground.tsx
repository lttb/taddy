import Head from 'next/head';

import {css} from 'taddy';

import {CodePanel} from '../components';

export default function Playground() {
    return (
        <>
            <Head>
                <script
                    async
                    src="https://unpkg.com/typescript@latest/lib/typescriptServices.js"
                ></script>
            </Head>

            <div {...css({padding: '10px 20px'})}>
                <h1 {...css({color: 'steelblue'})}>taddy</h1>

                <CodePanel />
            </div>
        </>
    );
}
