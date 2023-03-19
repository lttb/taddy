import {css} from 'taddy';

export default function Hello() {
    return (
        <h1 {...css({color: 'red', textDecoration: 'underline'})}>
            Hello World
        </h1>
    );
}
