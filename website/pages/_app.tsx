import Head from 'next/head';

import '@/styles/globals.css';
import '@/styles/taddy.css';

import {css} from 'taddy';

import {MDXProvider} from '@mdx-js/react';

import {createStore} from '@reatom/core';
import {context} from '@reatom/react';

import {Sidebar} from '@/components/Sidebar/index';
import sidebarStyles from '@/components/Sidebar/styles.module.css';

import {Link} from '@/components/Link';

const ico = require('@/public/favicon.ico');

const store = createStore();

const components = {
    a: (props) => <Link {...props} />,
    pre: (props) => <pre {...props} />,
    code: (props) => <code {...props} />,
};

function MyApp({Component, pageProps, router}) {
    const title = router.pathname.slice(1);

    return (
        <MDXProvider components={components}>
            <context.Provider value={store}>
                <div>
                    <Head>
                        <meta
                            content="width=device-width,initial-scale=1.0"
                            name="viewport"
                        />

                        <link rel="shortcut icon" href={ico} />

                        <title>taddy | {title}</title>
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
                                padding: '20px',
                                width: '100%',
                            })}
                        >
                            <div className={sidebarStyles.content}>
                                <Component {...pageProps} />
                            </div>
                        </div>
                    </div>
                </div>
            </context.Provider>
        </MDXProvider>
    );
}

export default MyApp;
