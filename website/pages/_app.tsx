import '../styles/globals.css';
import '../styles/taddy.css';

import {css} from 'taddy';
import Link from 'next/link';

import {createStore} from '@reatom/core';
import {context} from '@reatom/react';

const store = createStore();

function MyApp({Component, pageProps}) {
    return (
        <context.Provider value={store}>
            <div {...css({padding: '10px 20px'})}>
                <h1 {...css({color: 'steelblue'})}>
                    <Link href="/">
                        <a>taddy</a>
                    </Link>
                </h1>

                <div>
                    <Component {...pageProps} />
                </div>
            </div>
        </context.Provider>
    );
}

export default MyApp;
