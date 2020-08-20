import * as React from 'react';
import * as ReactDOM from 'react-dom';

import './taddy.css';

import App from './App';

const render = () => {
    ReactDOM.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
        document.getElementById('root'),
    );
};

render();
