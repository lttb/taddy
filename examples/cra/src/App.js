import React from 'react';

import {css} from 'taddy.macro';

const Kek = () => <div {...css({color: 'purple'})}>kek</div>

function App() {
    return (
        <h1
            {...css(
                {
                    color: 'orange',

                    // ...media('(min-width: 200px)', {
                    //     color: 'orange',
                    // }),
                    // ...media('(min-width: 1000px)', {
                    //     textDecoration: 'underline',
                    // }),

                    ':hover': {
                        color: 'orange',
                    },
                },
                // media('(min-width: 1000px)', {
                //     color: 'red',
                //     ':hover': {
                //         textDecoration: 'underline',
                //     },
                // }),
            )}
        >
            Hello <span>world</span>
            <Kek />
        </h1>
    );
}

export default App;
