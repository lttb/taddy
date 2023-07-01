import fs from 'fs';

import {PACKAGE_NAME, transform, getStyles, resetStyles} from './common';

const options = {
    compileOptions: {unstable_typescript: true},
};

describe('taddy.macro.typescript', () => {
    beforeEach((done) => {
        resetStyles();

        done();
    });

    // TODO: fix the filename consistency between local/CI tests
    test.skip('typed mixins', async () => {
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
                {filename: './test.infer-mixins.tsx'},
            ),
        ).toMatchInlineSnapshot(`
            "import { css } from "@taddy/core";
            import ".cache/taddy/kukjmn/1rx2e9b.taddy.css";
            export default css(\`_rnbphe_1vf95 _-g4lbay_2fa2 _-wnpzmr_eeql5n _t3u24i_1kgt43_2f0x _t2q38e_-mvl0b8_2c7gol\`, "__1p9m90k");"
        `);

        expect(getStyles()).toMatchInlineSnapshot(`
            "._rnbphe_1vf95 { display: flex; }
            ._-g4lbay_2fa2 { flex-direction: row; }
            ._-wnpzmr_eeql5n { caption-side: block-end; }
            ._t3u24i_1kgt43_2f0x:hover { color: red; }
            ._t2q38e_-mvl0b8_2c7gol:focus { border: 1px solid red; }"
        `);
    });

    // TODO: fix the filename consistency between local/CI tests
    test.skip('should support infer types', async () => {
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
                {filename: './test.infer-types.tsx'},
            ),
        ).toMatchInlineSnapshot(`
            "import { css } from "@taddy/core";
            import ".cache/taddy/o2loos/hqitgk.taddy.css";
            export default css("_-q8b8sh_-yoym18 _9wido6_1sxol _-k3s8v4_1d _t3u24i_1kgt43_2f0x _1kgt43_2f0x _rnbphe_1vf95", "__2hq8osn");"
        `);

        expect(getStyles()).toMatchInlineSnapshot(`
            "._rnbphe_1vf95 { display: flex; }
            ._-q8b8sh_-yoym18 { font-size: smaller; }
            ._-k3s8v4_1d { line-height: 1; }
            ._t3u24i_1kgt43_2f0x:hover,._1kgt43_2f0x { color: red; }
            ._9wido6_1sxol { font-weight: bold; }"
        `);
    });
});
