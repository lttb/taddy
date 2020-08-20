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
                left: '0',
                top: '0',
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
                textAlign: 'left',
            })}
        >
            {children}
        </code>
    );
};

export const CompiledCode = () => {
    const data = useAtom(transformAtom);

    const content = (
        <Row key="content" {...css(row({gap: 4}))}>
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

    const children = [content];

    if (data.status === 'error') {
        children.push(<Layer key="error">{data.error.toString()}</Layer>);
    } else if (data.status === 'pending') {
        children.push(<Layer key="pending">Compiling...</Layer>);
    }

    return <div {...css({position: 'relative'})}>{children}</div>;
};
