import {css} from 'taddy';

export default function Index() {
    return (
        <div {...css({fontFamily: 'system-ui, sans-serif', lineHeight: '1.4'})}>
            <h1 {...css({color: 'red'})}>Welcome to Remix</h1>
        </div>
    );
}
