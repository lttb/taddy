import * as React from 'react';
import {css} from 'taddy';

import {useAtom} from '@reatom/react';

import {row, Row} from '../layout';
import {transformAtom} from './atoms';
import {Editor} from './Editor';

const Layer = ({children}) => {
    return (
        <code
            {...css({
                position: 'absolute',
                left: 0,
                top: 0,
                width: '100%',
                height: '100%',
                whiteSpace: 'pre',
                background: 'rgb(99 20 20 / 80%)',
                zIndex: 5,
                padding: '20px',
                fontSize: '17px',
                fontFamily: 'monospace',
                color: 'white',
                fontWeight: 'bold',
            })}
        >
            {children}
        </code>
    );
};

export const CompiledCode = () => {
    const data = useAtom(transformAtom);

    const content = (
        <Row {...css(row({gap: 4}))}>
            <div>
                <h2>Compiled Module</h2>

                <Editor
                    highlightActiveLine={false}
                    value={data.result?.code}
                    readOnly
                />
            </div>

            <div>
                <h2>Compiled CSS</h2>

                <Editor
                    mode="css"
                    highlightActiveLine={false}
                    value={data.result?.css}
                    readOnly
                />
            </div>
        </Row>
    );

    if (data.status === 'done') {
        return <div>{content}</div>;
    }

    if (data.status === 'error') {
        return (
            <div>
                <Layer>{data.error.toString()}</Layer>

                {content}
            </div>
        );
    }

    return (
        <div>
            <Layer>Compiling...</Layer>

            {content}
        </div>
    );
};
