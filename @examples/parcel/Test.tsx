import React from 'react';
import {css} from 'taddy';
function Test() {
    console.log('kek');
    return (
        <span {...css({color: 'blue'})}>
            Hello <span {...css({color: 'purple'})}>test</span>
        </span>
    );
}
export default Test;
