import {declareAction, declareAtom} from '@reatom/core';

import {stripIndent} from 'common-tags';

type Playground = {
    options: {
        taddy: true;
        evaluate: boolean;
        unstable_typescript: boolean;
        unstable_CSSVariableFallback: boolean;
        unstable_useTaggedTemplateLiterals: boolean;
    };
    code: string;
};

export const updatePlayground = declareAction<Partial<Playground>>(
    async (payload, store) => {
        const {code: source, options} = store.getState(playgroundAtom);

        store.dispatch(setTransformedCode({status: 'pending'}));

        if (!options.taddy) {
            store.dispatch(
                setTransformedCode({
                    status: 'done',
                    result: {code: source, css: ''},
                }),
            );

            return;
        }

        const transformCode = await import('../../compiler').then(
            (x) => x.transformCode,
        );

        transformCode(source, options)
            .then((result) => {
                store.dispatch(setTransformedCode({status: 'done', result}));
            })
            .catch((error) => {
                console.error(error);

                store.dispatch(
                    setTransformedCode({
                        status: 'error',
                        error,
                    }),
                );
            });
    },
);
export const playgroundAtom = declareAtom<Playground>(
    {
        code: '',
        options: {
            taddy: true,
            unstable_typescript: true,
            evaluate: true,
            unstable_CSSVariableFallback: true,
            unstable_useTaggedTemplateLiterals: true,
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

export type CompiledData = {result?: {code: string; css: string}} & (
    | {status: 'pending'}
    | {status: 'done'}
    | {error: Error; status: 'error'}
);

export const setTransformedCode = declareAction<CompiledData>();
export const transformAtom = declareAtom<CompiledData>(
    {status: 'done', result: {code: '', css: ''}},
    (on) => [
        on(setTransformedCode, (state, payload) => ({...state, ...payload})),
    ],
);
