import React from 'react';

import {css, media} from 'taddy.macro';

function App() {
    return (
        <h1
            {...css(
                {
                    color: 'green',

                    ...media('(min-width: 200px)', {
                        color: 'orange',
                    }),
                    ...media('(min-width: 1000px)', {
                        textDecoration: 'underline',
                    }),

                    ':hover': {
                        color: 'orange',
                    },
                },
                media('(min-width: 1000px)', {
                    color: 'red',
                    ':hover': {
                        textDecoration: 'underline',
                    },
                }),
            )}
        >
            Hello <span>world</span>
        </h1>
    );
}

export default App;
