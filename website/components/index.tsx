import * as React from 'react';

import {declareAction, declareAtom} from '@reatom/core';
import {useAction, useAtom} from '@reatom/react';

import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-typescript';
import 'ace-builds/src-noconflict/mode-css';
import 'ace-builds/src-noconflict/theme-textmate';
import 'ace-builds/src-noconflict/ext-language_tools';

import Code, {code} from './Code';

import {css} from 'taddy';

import {transformCode} from '../compiler';

import {createStore} from '@reatom/core';
import {context} from '@reatom/react';

import {column, row} from './mixins';

// if (module.hot) {
//     module.hot.accept('./mixins.ts', () => {
//         module.hot.data._kek_ =
//         console.log('kek');
//         module.hot.invalidate();
//         module.hot.accept();
//     });
//     console.log('update');
//     module.hot.accept();
// }

const store = createStore();

type Playground = {
    options: {
        typescript: boolean;
        evaluate: boolean;
        unstable_CSSVariableFallback: boolean;
    };
    code: string;
};

const updatePlayground = declareAction<Partial<Playground>>(
    async (payload, store) => {
        const {code: source, options} = store.getState(playgroundAtom);

        store.dispatch(setTransformedCode({status: 'pending'}));

        transformCode(source, options)
            .then((result) => {
                store.dispatch(setTransformedCode({status: 'done', result}));

                code.onChange(source);

                code.scheduleLinkUpdate();
            })
            .catch((error) =>
                store.dispatch(
                    setTransformedCode({
                        status: 'error',
                        error,
                    }),
                ),
            );
    },
);
const playgroundAtom = declareAtom<Playground>(
    {
        code: code.value,
        options: {
            typescript: true,
            evaluate: true,
            unstable_CSSVariableFallback: true,
        },
    },
    (on) => [
        on(updatePlayground, (state, payload) => ({
            ...state,
            ...payload,
            options: {
                ...state.options,
                ...payload.options,
            },
        })),
    ],
);

type CompiledData = {result?: {code: string; css: string}} & (
    | {status: 'pending'}
    | {status: 'done'}
    | {error: Error; status: 'error'}
);

const setTransformedCode = declareAction<CompiledData>();
const transformAtom = declareAtom<CompiledData>(
    {status: 'done', result: {code: '', css: ''}},
    (on) => [
        on(setTransformedCode, (state, payload) => ({...state, ...payload})),
    ],
);

const Options = () => {
    const options = useAtom(playgroundAtom, (x) => x.options, ['options']);
    const handleOption = useAction((e) =>
        updatePlayground({options: {[e.target.name]: !!e.target.checked}}),
    );

    return (
        <div {...css(row({gap: 4, inline: true}))}>
            <label>
                <input
                    type="checkbox"
                    name="typescript"
                    checked={options.typescript}
                    onChange={handleOption}
                />
                Typescript
            </label>

            <label>
                <input
                    type="checkbox"
                    name="evaluate"
                    checked={options.evaluate}
                    onChange={handleOption}
                />
                Evaluate
            </label>

            <label>
                <input
                    type="checkbox"
                    name="unstable_CSSVariableFallback"
                    checked={options.unstable_CSSVariableFallback}
                    onChange={handleOption}
                />
                unstable_CSSVariableFallback
            </label>
        </div>
    );
};

const _Editor = (props) => (
    <AceEditor
        mode="typescript"
        theme="textmate"
        showPrintMargin={false}
        maxLines={Infinity}
        width="100%"
        {...props}
    />
);

export const Editor = () => {
    const code = useAtom(playgroundAtom, (x) => x.code, ['code']);
    const handleCode = useAction((code) => updatePlayground({code}));

    React.useEffect(() => {
        setTimeout(() => {
            handleCode(code);
        }, 100);
    }, []);

    return (
        <div>
            <h2>Source Code</h2>

            <_Editor
                debounceChangePeriod={50}
                value={code}
                onChange={handleCode}
                name="TADDY_EDITOR"
                editorProps={{$blockScrolling: true}}
                setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                }}
            />
        </div>
    );
};

const Compiled = ({
    children,
}: {
    children: (data: CompiledData) => React.ReactElement | null;
}) => {
    const state = useAtom(transformAtom);

    return children(state);
};

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

export const CompiledRender = () => {
    return (
        <Compiled>
            {(data) => {
                const content = (
                    <div {...css(row({gap: 4}))}>
                        <div>
                            <h2>Compiled Module</h2>

                            <_Editor
                                highlightActiveLine={false}
                                value={data.result?.code}
                                readOnly
                            />
                        </div>

                        <div>
                            <h2>Compiled CSS</h2>

                            <_Editor
                                mode="css"
                                highlightActiveLine={false}
                                value={data.result?.css}
                                readOnly
                            />
                        </div>
                    </div>
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
            }}
        </Compiled>
    );
};

export const CodePanel = () => (
    <context.Provider value={store}>
        <div {...css(column({gap: 4}))}>
            <Options />

            {console.log('hello')}

            <div {...css(row({gap: 4}), {width: '100%'})}>
                <Editor />

                <CompiledRender />
            </div>

            <Code />
        </div>
    </context.Provider>
);
