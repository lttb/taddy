import {PACKAGE_NAME, transform, getStyles, resetStyles} from './common';

const options = {
    compileOptions: {unstable_typescript: true},
};

describe('taddy.macro.typescript', () => {
    beforeEach((done) => {
        resetStyles();

        done();
    });

    test('typed mixins', async () => {
        expect(
            await transform(
                `
            import {css} from '${PACKAGE_NAME}'

            function box<D extends 'row' | 'column' = 'column'>({direction = 'column' as D}: {direction?: D}) {
                return css.mixin({
                    display: 'flex',
                    flexDirection: direction,
                    captionSide: 'block-end',

                    composes: [
                        css.mixin({':hover': {
                            color: 'red',
                        }}),

                        css.mixin({':focus': {
                            border: '1px solid red',
                        }}),
                    ],
                });
            }

            export default css({
                ...box({direction: 'row'}),
            })
        `,
                options,
            ),
        ).toMatchInlineSnapshot(`
            "import { css } from "@taddy/core";
            import "@taddy/babel-plugin/cache/2781031252.taddy.css";
            export default css("_rnbphe_1vf95 _bi7y5n_2fa2 _-ikiluq_eeql5n _t3u24i_1kgt43_2f0x _t2q38e_-mvl0b8_2c7gol", "__17gkjp6");"
        `);

        expect(getStyles()).toMatchInlineSnapshot(`
            "._rnbphe_1vf95 { display: flex; }
            ._bi7y5n_2fa2 { flex-direction: row; }
            ._-ikiluq_eeql5n { caption-side: block-end; }
            ._t3u24i_1kgt43_2f0x:hover { color: red; }
            ._t2q38e_-mvl0b8_2c7gol:focus { border: 1px solid red; }"
        `);
    });

    test('should support infer types', async () => {
        expect(
            await transform(
                `
                import {css} from '${PACKAGE_NAME}'
                import {box, typo} from './data/mixins'

                function mixin<T extends 'smaller' | 'larger'>(size: T) {
                    return css.mixin({
                        ...box,
                        ...typo,
                        display: 'flex',
                        fontSize: size
                    })
                }

                const display = 'flex'

                export default css({
                    ...mixin('smaller'),
                    ...box,
                    ...typo,
                    color: 'red',
                    display,
                })
            `,
                options,
            ),
        ).toMatchInlineSnapshot(`
            "import { css } from "taddy";
            import "@taddy/babel-plugin/cache/2781031252.taddy.css";
            import { box, typo } from './data/mixins';
            function mixin<T extends 'smaller' | 'larger'>(size: T) {
              return css.mixin({
                ...box,
                ...typo,
                display: 'flex',
                fontSize: size
              });
            }
            const display = 'flex';
            export default css({
              ...mixin('smaller'),
              ...box,
              ...typo,
              _1kgt43: "_2f0x",
              _rnbphe: "_2se5ms",
              __VARS__: {
                "--_rnbphe": display
              }
            }, "__17gkjp6");"
        `);

        expect(getStyles()).toMatchInlineSnapshot(`
            "._1kgt43_2f0x { color: red; }
            ._rnbphe_2se5ms { display: var(--_rnbphe); }
            ._rnbphe_1vf95 { display: flex; }"
        `);
    });
});
