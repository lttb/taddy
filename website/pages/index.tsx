import {css} from 'taddy';

import {CodePanel} from '../components';

export default function Home() {
    return (
        <div {...css({padding: '10px 20px'})}>
            <h1 {...css({color: 'steelblue'})}>taddy</h1>

            <CodePanel />
        </div>
    );
}
