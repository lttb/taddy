import {PACKAGE_NAME, transform, getStyles, resetStyles} from './common';

const options = {
    compileOptions: {evaluate: true},
};

describe('taddy.macro.evaluate', () => {
    beforeEach((done) => {
        resetStyles();

        done();
    });

    test('variables', async () => {
        expect(
            await transform(
                `
                import {css} from '${PACKAGE_NAME}'

                const color = 'red'

                export default css({
                    color,
                    margin: 0,
                })
            `,
                options,
            ),
        ).toMatchInlineSnapshot(`
            "import { css } from "@taddy/core";
            import "@taddy/babel-plugin/cache/1158222605.taddy.css";
            export default css("_1kgt43_2f0x _-hvs7yq_1c", "__17gkjp6");"
        `);

        expect(getStyles()).toMatchInlineSnapshot(`
            "._1kgt43_2f0x { color: red; }
            ._-hvs7yq_1c { margin: 0px; }"
        `);
    });

    test('evaluate mixins', async () => {
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
            import "@taddy/babel-plugin/cache/1158222605.taddy.css";
            export default css("_rnbphe_1vf95 _bi7y5n_2fa2 _-ikiluq_eeql5n _t3u24i_1kgt43_2f0x _t2q38e_-mvl0b8_2c7gol", "__17gkjp6");"
        `);

        expect(getStyles()).toMatchInlineSnapshot(`
            "._t3u24i_1kgt43_2f0x:hover { color: red; }
            ._t2q38e_-mvl0b8_2c7gol:focus { border: 1px solid red; }
            ._rnbphe_1vf95 { display: flex; }
            ._bi7y5n_2fa2 { flex-direction: row; }
            ._-ikiluq_eeql5n { caption-side: block-end; }"
        `);
    });

    test('evaluate with mixins from other modules', async () => {
        expect(
            await transform(
                `
                import {css} from '${PACKAGE_NAME}'
                import {box, typo} from '@taddy/babel-plugin/src/tests/data/mixins'

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
            "import { css } from "@taddy/core";
            import "@taddy/babel-plugin/cache/1158222605.taddy.css";
            export default css("_9wido6_1sxol _-k3s8v4_1d _t3u24i_1kgt43_2f0x _rnbphe_1vf95 _-q8b8sh_-yoym18 _1kgt43_2f0x", "__17gkjp6");"
        `);

        expect(getStyles()).toMatchInlineSnapshot(`
            "._9wido6_1sxol { font-weight: bold; }
            ._-k3s8v4_1d { line-height: 1; }
            ._t3u24i_1kgt43_2f0x:hover,._1kgt43_2f0x { color: red; }
            ._rnbphe_1vf95 { display: flex; }
            ._-q8b8sh_-yoym18 { font-size: smaller; }"
        `);
    });

    test('evaluate function declared as variable', async () => {
        expect(
            await transform(
                `
                import { css } from "${PACKAGE_NAME}";

                const box = () => css.mixin({
                    border: "1px solid red",
                });

                const typo = css.mixin({
                    fontSize: '14px',
                })

                const color = "red";

                export default css({ color, ...typo, ...box() });
        `,
                options,
            ),
        ).toMatchInlineSnapshot(`
            "import { css } from "@taddy/core";
            import "@taddy/babel-plugin/cache/1158222605.taddy.css";
            export default css("_1kgt43_2f0x _-q8b8sh_wfor _-mvl0b8_2c7gol", "__17gkjp6");"
        `);

        expect(getStyles()).toMatchInlineSnapshot(`
            "._-q8b8sh_wfor { font-size: 14px; }
            ._-mvl0b8_2c7gol { border: 1px solid red; }
            ._1kgt43_2f0x { color: red; }"
        `);
    });

    test('evaluate function composition', async () => {
        expect(
            await transform(
                `
                import { css } from "${PACKAGE_NAME}";

                const a = () => css({color: 'red'})
                const b = () => css({fontSize: '20px'})

                export default css(a(), b());
        `,
                options,
            ),
        ).toMatchInlineSnapshot(`
            "import { css } from "@taddy/core";
            import "@taddy/babel-plugin/cache/1158222605.taddy.css";
            export default css("_1kgt43_2f0x __17gkjp6 _-q8b8sh_wzpi __3kqvnq5", "__5qvnr4");"
        `);

        expect(getStyles()).toMatchInlineSnapshot(`
            "._1kgt43_2f0x { color: red; }
            ._-q8b8sh_wzpi { font-size: 20px; }"
        `);
    });

    test('mixins without inferrable value', async () => {
        expect(
            await transform(
                `
                import { css } from "${PACKAGE_NAME}";

                const size = (v: number) => v * 4 + 'px';
                const margin = (gapY: number, gapX: number) =>
                    size(gapY / 2) + ' ' + size(gapX / 2);

                function flex({inline}) {
                    return css({
                        display: inline ? 'inline-flex' : 'flex',

                        ...(!inline && {
                            flex: 1,
                        }),
                    });
                }

                export function column({
                    gap = 0,
                    inline = false,
                }: {gap?: Size; gapY?: Size; gapX?: Size; inline?: boolean} = {}) {
                    return css({
                        ...flex({inline}),

                        '> *:not(:empty) + *:not(:empty)': {
                            marginTop: size(gap),
                        },
                    });
                }

                export default css(column({gap, inline}), {style, className});
        `,
                options,
            ),
        ).toMatchInlineSnapshot(`
            "import { css } from "taddy";
            import "@taddy/babel-plugin/cache/1158222605.taddy.css";
            const size = (v: number) => v * 4 + 'px';
            const margin = (gapY: number, gapX: number) => size(gapY / 2) + ' ' + size(gapX / 2);
            function flex({
              inline
            }) {
              return css({
                "_rnbphe": "_2se5ms",
                ...(!inline && {
                  "_1vf95": "_1d"
                }),
                __VARS__: {
                  "--_rnbphe": inline ? 'inline-flex' : 'flex'
                }
              }, "__17gkjp6");
            }
            export function column({
              gap = 0,
              inline = false
            }: {
              gap?: Size;
              gapY?: Size;
              gapX?: Size;
              inline?: boolean;
            } = {}) {
              return css({
                ...flex({
                  inline
                }),
                "_dgc417_wkwhiu": "_-lw5rk0",
                __VARS__: {
                  "--_dgc417_-ha1ird": size(gap)
                }
              }, "__3kqvnq5");
            }
            export default css(column({
              gap,
              inline
            }), {
              style,
              className
            }, "__5qvnr4");"
        `);

        expect(getStyles()).toMatchInlineSnapshot(`
            "._rnbphe_2se5ms { display: var(--_rnbphe); }
            ._1vf95_1d { flex-grow: 1; flex-shrink: 1; flex-basis: 0%; }
            ._dgc417_wkwhiu_-lw5rk0> *:not(:empty) + *:not(:empty) { margin-top: var(--_dgc417_-ha1ird); }"
        `);
    });
});
