import React from 'react';

import {css, media} from 'taddy';

function App() {
    return (
        <h1
            {...css(
                {
                    color: 'green',

                    ...media('all and (min-width: 200px)', {
                        color: 'orange',
                    }),
                    ...media('all and (min-width: 1000px)', {
                        textDecoration: 'underline',
                    }),

                    ':hover': {
                        color: 'green',
                    },
                },
                media('all and (min-width: 1000px)', {
                    color: 'red',
                    ':hover': {
                        textDecoration: 'underline',
                    },
                }),
            )}
        >
            Hello{' '}
            <span
                {...css(
                    media('all and (min-width: 1000px)', {
                        color: 'green',
                    }),
                )}
            >
                world
            </span>
        </h1>
    );
}

export default App;
