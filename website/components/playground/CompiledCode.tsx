import * as React from 'react';
import {css} from 'taddy';

import {useAtom} from '@reatom/react';

import {column, Row} from '../layout';
import {transformAtom} from './atoms';
import {Editor} from './Editor';
import {EditorLayer} from './EditorLayer';

const Title = ({children}) => <h2 {...css({color: 'darkgrey'})}>{children}</h2>;

export const CompiledCode = () => {
    const data = useAtom(transformAtom);

    const content = (
        <Row key="content" {...css(column({gap: 4}))}>
            <div>
                <Title>Compiled Module</Title>

                <Editor
                    highlightActiveLine={false}
                    value={data.result?.code}
                    readOnly
                />
            </div>

            <div>
                <Title>Compiled CSS</Title>

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
