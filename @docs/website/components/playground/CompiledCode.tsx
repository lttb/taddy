import { css } from 'taddy';

import { useAtom } from '@reatom/react';
import type { PropsWithChildren } from 'react';

import { Column, Row } from '../layout';
import { transformAtom } from './atoms';
import { Editor } from './Editor';
import { EditorLayer } from './EditorLayer';
import { ReactRender } from './ReactRender';

const Title = ({ children }: PropsWithChildren) => <h2>{children}</h2>;

const Wrapper = ({ children }: PropsWithChildren) => (
    <div
        {...css({
            overflowX: 'auto',
            position: 'relative',
            padding: '0 20px 20px',
            borderRadius: '16px',
            minWidth: '300px',
            width: '100%',
            boxShadow: '0px 3px 10px 0px rgba(16, 60, 78, 0.15)'
        })}
    >
        {children}
    </div>
);

export const CompiledCode = ({
    showCompiledCode,
    showCompiledCSS,
    showRender,
    useTest
}: {
    showCompiledCode?: boolean;
    showCompiledCSS?: boolean;
    showRender?: boolean;
    useTest?: boolean
}) => {
    const data = useAtom(transformAtom);

    let layerProps: React.ComponentProps<typeof EditorLayer> = {};

    if (data.status === 'error') {
        layerProps = { variant: 'error', children: data.error.toString() };
    } else if (data.status === 'pending') {
        layerProps = { variant: 'compiling', children: 'Compiling...' };
    }

    const content = (
        <Column
            gap={4}
            key="content"
            {...css({
                ' .ace_placeholder': {
                    fontSize: '20px',
                    color: 'black',
                },
            })}
        >
            {showRender && (
                <Wrapper>
                    <Title>Render</Title>

                    <ReactRender code={data.result?.code} />
                </Wrapper>
            )}

            {showCompiledCode && (
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
            )}

            {showCompiledCSS && (
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
            )}
        </Column>
    );

    return (
        <div
            {...css({
                width: '100%',
                position: 'relative',
            })}
        >
            {content}

            <EditorLayer {...css({ borderRadius: useTest ? '8px' : '20px' })} {...layerProps} />
        </div>
    );
};
