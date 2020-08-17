import * as React from 'react';
import * as ReactDOM from 'react-dom';

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

if ((module as any).hot) {
    (module as any).hot.accept('./App', () => {
        render();
    });
}
