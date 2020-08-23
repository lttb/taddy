import Head from 'next/head';

import '../styles/globals.css';
import '../styles/taddy.css';

import {css} from 'taddy';

import {createStore} from '@reatom/core';
import {context} from '@reatom/react';

import {Sidebar} from '../components/Sidebar/index';
import sidebarStyles from '../components/Sidebar/styles.module.css';

const ico = require('../public/favicon.ico');

const store = createStore();

function MyApp({Component, pageProps}) {
    return (
        <context.Provider value={store}>
            <div>
                <Head>
                    <meta
                        content="width=device-width,initial-scale=1.0"
                        name="viewport"
                    />

                    <link rel="shortcut icon" href={ico} />
                </Head>

                <div
                    {...css({
                        width: '100%',
                        display: 'inline-flex',
                        flexDirection: 'row',
                    })}
                >
                    <Sidebar />

                    <div
                        {...css({
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                        })}
                    >
                        <div className={sidebarStyles.content}>
                            <Component {...pageProps} />
                        </div>
                    </div>
                </div>
            </div>
        </context.Provider>
    );
}

export default MyApp;
