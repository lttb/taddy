import {css} from 'taddy';

import {SuperComponent} from './SuperComponent';

export default function Home() {
    return (
        <div {...css({color: 'red', textDecoration: 'underline'})}>
            hello, hoh!!!
            <SuperComponent />
        </div>
    );
}
