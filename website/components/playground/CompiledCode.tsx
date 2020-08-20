import * as React from 'react';
import {css, $} from 'taddy';

import {useAtom} from '@reatom/react';

import {column, Row} from '../layout';
import {transformAtom} from './atoms';
import {Editor} from './Editor';
import {EditorLayer} from './EditorLayer';

export const CompiledCode = () => {
    const data = useAtom(transformAtom);

    const content = (
        <Row
            key="content"
            {...css(column({gap: 4}), {
                [$` h2`]: {
                    color: 'darkgrey',
                },
            })}
        >
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

    let layerProps: React.ComponentProps<typeof EditorLayer> = {};

    if (data.status === 'error') {
        layerProps = {variant: 'error', children: data.error.toString()};
    } else if (data.status === 'pending') {
        layerProps = {variant: 'compiling', children: 'Compiling...'};
    }

    return (
        <div {...css({position: 'relative'})}>
            {content}

            <EditorLayer {...layerProps} />
        </div>
    );
};
