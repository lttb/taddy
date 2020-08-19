import '../styles/globals.css';
import '../styles/taddy.css';

import {css} from 'taddy';
import Link from 'next/link';

function MyApp({Component, pageProps}) {
    return (
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
    );
}

export default MyApp;
