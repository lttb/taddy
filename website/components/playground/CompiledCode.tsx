import * as React from 'react';
import {css} from 'taddy';

import {useAtom} from '@reatom/react';

import {column, Row} from '../layout';
import {transformAtom} from './atoms';
import {Editor} from './Editor';
import {EditorLayer} from './EditorLayer';

const Title = ({children}) => <h2>{children}</h2>;

const Wrapper = ({children}) => (
    <div
        {...css({
            overflow: 'hidden',
            position: 'relative',
            padding: '0 20px 20px',
            boxShadow: '0 0 13px -10px',
            borderRadius: '20px',
        })}
    >
        {children}
    </div>
);

export const CompiledCode = () => {
    const data = useAtom(transformAtom);

    let layerProps: React.ComponentProps<typeof EditorLayer> = {};

    if (data.status === 'error') {
        layerProps = {variant: 'error', children: data.error.toString()};
    } else if (data.status === 'pending') {
        layerProps = {variant: 'compiling', children: 'Compiling...'};
    }

    const content = (
        <Row
            key="content"
            {...css(column({gap: 4}), {
                ' .ace_placeholder': {
                    fontSize: '20px',
                    color: 'black',
                },
            })}
        >
            <Wrapper>
                <Title>Compiled Module</Title>

                <Editor
                    highlightActiveLine={false}
                    value={data.result?.code}
                    readOnly
                    showGutter={false}
                    placeholder="There should be compiled module code"
                />
            </Wrapper>

            <Wrapper>
                <Title>Compiled CSS</Title>

                <Editor
                    mode="css"
                    highlightActiveLine={false}
                    value={data.result?.css}
                    readOnly
                    showGutter={false}
                    placeholder="There should be compiled css code"
                />
            </Wrapper>
        </Row>
    );

    return (
        <div
            {...css({
                position: 'relative',
            })}
        >
            {content}

            <EditorLayer {...css({borderRadius: '20px'})} {...layerProps} />
        </div>
    );
};
