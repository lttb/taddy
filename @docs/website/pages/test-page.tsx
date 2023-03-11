import {css} from 'taddy';

import Playground from '../components/playground';

export default function Test() {
    return (
        <div {...css({padding: '30px'})}>
            <h3>Example 1</h3>
            <Playground
                showRender
                initialCode={`
                import React from 'react'
                import {css} from 'taddy'

                export default <div {...css({color: 'red'})}>hello!</div>
            `}
            />

            <h3>Example 2</h3>
            <Playground
                showRender
                initialCode={`
                import React from 'react'
                import {css} from 'taddy'

                export default <div {...css({color: 'red'})}>hello!</div>
            `}
            />
        </div>
    );
}
