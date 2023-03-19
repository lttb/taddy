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
            "import { css } from "taddy";
            import "@taddy/babel-plugin/cache/3861607554.taddy.css";
            let className = 'class';
            let style = {
              color: 'green'
            };
            let color = 'red';
            export default css({
              className,
              style,
              "_1kgt43": "_-t7a17f",
              "_t3u24i_1kgt43": "_1svoa",
              __VARS__: {
                "--_1kgt43": color
              }
            }, "__o58cu9");"
        `);

        expect(getStyles()).toMatchInlineSnapshot(`
            "._1kgt43_-t7a17f { color: var(--_1kgt43); }
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
            import "@taddy/babel-plugin/cache/3861607554.taddy.css";
            export default css("_-kygmid_1c", "__o58cu9");"
        `);

        expect(getStyles()).toMatchInlineSnapshot(
            `"._-kygmid_1c { opacity: 0; }"`,
        );
    });
});
