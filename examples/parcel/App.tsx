import React from 'react';
import {css} from 'taddy';
import Test from './Test';
function App() {
    console.log('kek');
    return (
        <h1 {...css({color: 'blue'})}>
            Hello <span {...css({color: 'green'})}>world</span>
            <Test />
        </h1>
    );
}
export default App;
