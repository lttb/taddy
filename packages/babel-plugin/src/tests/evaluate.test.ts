import {PACKAGE_NAME, transform, getStyles, resetStyles} from './common';

const options = {
    compileOptions: {evaluate: true},
};

describe('taddy.macro.evaluate', () => {
    beforeEach(() => {
        resetStyles();
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
            "import { css } from \\"@taddy/core\\";
            export default css(\\"_15b0_2efe _37f5_b50d _bb63_616f _69bc_9bfd_4da4 _0c75_ce9a_9fbe\\", \\"__2lpj959\\");"
        `);

        expect(getStyles()).toMatchInlineSnapshot(`
            "._69bc_9bfd_4da4:hover {color: red;}
            ._0c75_ce9a_9fbe:focus {border: 1px solid red;}
            ._15b0_2efe {display: flex;}
            ._37f5_b50d {flex-direction: row;}
            ._bb63_616f {caption-side: block-end;}"
        `);
    });

    test('evaluate with mixins from other modules', async () => {
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
            "import { css } from \\"@taddy/core\\";
            export default css(\\"_3e02_3da8 _8ef9_849b _69bc_9bfd_4da4 _15b0_2efe _a1f1_dd91 _9bfd_4da4\\", \\"__2lpj959\\");"
        `);

        expect(getStyles()).toMatchInlineSnapshot(`
            "._3e02_3da8 {font-weight: bold;}
            ._8ef9_849b {line-height: 1;}
            ._69bc_9bfd_4da4:hover,._9bfd_4da4 {color: red;}
            ._15b0_2efe {display: flex;}
            ._a1f1_dd91 {font-size: smaller;}"
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
            "import { css } from \\"@taddy/core\\";
            export default css(\\"_9bfd_4da4 _a1f1_1340 _ce9a_9fbe\\", \\"__2lpj959\\");"
        `);
    });
});
