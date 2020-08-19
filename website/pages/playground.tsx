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

            <CodePanel />
        </>
    );
}
