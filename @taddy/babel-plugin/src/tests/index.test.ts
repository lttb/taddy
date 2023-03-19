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
});
