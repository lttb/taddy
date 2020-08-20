import {PACKAGE_NAME, transform, getStyles, resetStyles} from './common';

const options = {
    compileOptions: {typescript: true},
};

describe('taddy.macro.typescript', () => {
    beforeEach(() => {
        resetStyles();
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
            "import { css } from \\"@taddy/core\\";
            export default css(\\"_15b0_2efe _37f5_b50d _bb63_616f _69bc_9bfd_4da4 _0c75_ce9a_9fbe\\");"
        `);

        expect(getStyles()).toMatchInlineSnapshot(`
            "._15b0_2efe {display: flex;}
            ._37f5_b50d {flex-direction: row;}
            ._bb63_616f {caption-side: block-end;}
            ._69bc_9bfd_4da4:hover {color: red;}
            ._0c75_ce9a_9fbe:focus {border: 1px solid red;}"
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
            "import { css } from \\"@taddy/core\\";
            import { box, typo } from './data/mixins';
            export default css(\\"_a1f1_dd91 _3e02_3da8 _8ef9_849b _69bc_9bfd_4da4 _9bfd_4da4 _15b0_2efe\\");"
        `);

        expect(getStyles()).toMatchInlineSnapshot(`
            "._15b0_2efe {display: flex;}
            ._a1f1_dd91 {font-size: smaller;}
            ._8ef9_849b {line-height: 1;}
            ._69bc_9bfd_4da4:hover,._9bfd_4da4 {color: red;}
            ._3e02_3da8 {font-weight: bold;}"
        `);
    });
});
