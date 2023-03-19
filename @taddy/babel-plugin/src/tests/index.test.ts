import {PACKAGE_NAME, transform, getStyles, resetStyles} from './common';

describe('taddy.macro', () => {
    beforeEach((done) => {
        resetStyles();

        done();
    });

    test('should transform with style, dynamic variables and className', async () => {
        expect(
            await transform(`
                import {css} from '${PACKAGE_NAME}'

                let className = 'class'
                let style = {color: 'green'}
                let color = 'red'

                export default css({
                    className,
                    style,
                    color,

                    ':hover': {
                        color: 'blue',
                    }
                })
            `),
        ).toMatchInlineSnapshot(`
            "import { css } from "@taddy/core";
            import "@taddy/babel-plugin/cache/1158222605.taddy.css";
            export default css("class _1kgt43_2f0x _t3u24i_1kgt43_1svoa", "__17gkjp6");"
        `);

        expect(getStyles()).toMatchInlineSnapshot(`
            "._1kgt43_2f0x { color: red; }
            ._t3u24i_1kgt43_1svoa:hover { color: blue; }"
        `);
    });

    test('should omit invalid values', async () => {
        expect(
            await transform(`
                import {css} from '${PACKAGE_NAME}'

                export default css({
                    opacity: 0,
                    color: '',
                    top: null,
                    bottom: false,
                    display: undefined,
                })
            `),
        ).toMatchInlineSnapshot(`
            "import { css } from "@taddy/core";
            import "@taddy/babel-plugin/cache/1158222605.taddy.css";
            export default css("_-kygmid_1c", "__17gkjp6");"
        `);

        expect(getStyles()).toMatchInlineSnapshot(
            `"._-kygmid_1c { opacity: 0; }"`,
        );
    });

    test('should process at rules', async () => {
        expect(
            await transform(`
                import {css} from '${PACKAGE_NAME}'

                export default css({
                    color: '#000',
                    '@container': {
                        'min-width: 250px': {
                            color: 'red',

                            ':hover': { color: 'grey' },
                        },   
                        'min-width: 450px': {
                            color: 'lightgrey',

                            ':hover': { color: 'lightblue' },
                        }   
                    },
                    '@media': {
                        'min-width: 300px': {
                            color: 'yellow',

                            ':hover': { color: 'blue' },
                        },   
                        'min-width: 600px': {
                            color: 'green',

                            ':hover': { color: 'purple' },
                        }   
                    }
                })
            `),
        ).toMatchInlineSnapshot(`
            "import { css } from "@taddy/core";
            import "@taddy/babel-plugin/cache/1158222605.taddy.css";
            export default css("_1kgt43_ndbh _-1p9wvz_-wkmtks_1kgt43_2f0x _-1p9wvz_-wkmtks_t3u24i_1kgt43_1w6ov _-1p9wvz_-wjj8e2_1kgt43_bckm45 _-1p9wvz_-wjj8e2_t3u24i_1kgt43_bchb3k _w0o0bo_-wk67x2_1kgt43_-c55ax8 _w0o0bo_-wk67x2_t3u24i_1kgt43_1svoa _w0o0bo_-wiiu4z_1kgt43_1mpr0j _w0o0bo_-wiiu4z_t3u24i_1kgt43_-g5na6c", "__17gkjp6");"
        `);

        expect(getStyles()).toMatchInlineSnapshot(`
            "._1kgt43_ndbh { color: #000; }
            @container (min-width: 250px) { ._-1p9wvz_-wkmtks_1kgt43_2f0x { color: red; }._-1p9wvz_-wkmtks_t3u24i_1kgt43_1w6ov:hover { color: grey; } }
            @container (min-width: 450px) { ._-1p9wvz_-wjj8e2_1kgt43_bckm45 { color: lightgrey; }._-1p9wvz_-wjj8e2_t3u24i_1kgt43_bchb3k:hover { color: lightblue; } }
            @media (min-width: 300px) { ._w0o0bo_-wk67x2_1kgt43_-c55ax8 { color: yellow; }._w0o0bo_-wk67x2_t3u24i_1kgt43_1svoa:hover { color: blue; } }
            @media (min-width: 600px) { ._w0o0bo_-wiiu4z_1kgt43_1mpr0j { color: green; }._w0o0bo_-wiiu4z_t3u24i_1kgt43_-g5na6c:hover { color: purple; } }"
        `);
    });
});
