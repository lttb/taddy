import React from 'react';

import {css} from 'taddy.macro';

function App() {
    return <h1 {...css({color: 'green'})}>Hello world</h1>;
}

export default App;
