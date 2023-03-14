import {css} from 'taddy';

function Test() {
    return (
        <span {...css({color: 'blue'})}>
            Hello <span {...css({color: 'purple'})}>test</span>
        </span>
    );
}
export default Test;
