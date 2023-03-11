import Head from 'next/head';

import '@docs/website/styles/globals.css';
import '@docs/website/styles/taddy.css';

// import '@taddy/babel-plugin/.cache';
// import '@taddy/babel-plugin/.cache/index.css';

import {css} from 'taddy';

import {MDXProvider} from '@mdx-js/react';

import {createStore} from '@reatom/core';
import {context} from '@reatom/react';

import {Sidebar} from '@docs/website/components/Sidebar/index';
import sidebarStyles from '@docs/website/components/Sidebar/styles.module.css';

import {Link} from '@docs/website/components/Link';
import {AppProps} from 'next/app';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ico = require('@docs/website/public/favicon.ico');

const store = createStore();

const components = {
    a: (props) => <Link {...props} />,
    pre: (props) => <pre {...props} />,
    code: ({...props}) => <code {...props} />,
    inlineCode: ({className, ...props}) => (
        <code
            {...props}
            {...css({
                padding: '4px',
                borderRadius: '4px',
                display: 'inline-flex',
                lineHeight: '1.2',
                background: '#f3f0f3',
                color: 'black',
                className,
            })}
        />
    ),
};

function MyApp({Component, pageProps, router}: AppProps) {
    const name = router.pathname.slice(1);
    const title = 'taddy' + (name ? ' | ' + name : '');

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

                        <title>{title}</title>
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
