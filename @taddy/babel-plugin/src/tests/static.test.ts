import {PACKAGE_NAME, transform, getStyles, resetStyles} from './common';

jest.mock('fs');

describe('taddy.macro.static', () => {
    beforeEach((done) => {
        resetStyles();

        done();
    });

    test('should not transform spreads', async () => {
        expect(
            await transform(`
                import {css} from '${PACKAGE_NAME}'

                let variant = 'normal'
                export default css({
                    color: 'red',
                    ...variant === 'normal' && {
                        color: 'blue',
                    }
                })
            `),
        ).toMatchInlineSnapshot(`
            "import { css } from "@taddy/core";
            import ".cache/taddy/j5kqa5/1dsv92m.taddy.css";
            export default css(\`_1kgt43_1svoa\`, "__17gkjp6");"
        `);

        expect(getStyles()).toMatchInlineSnapshot(`
            "._1kgt43_2f0x { color: red; }
            ._1kgt43_1svoa { color: blue; }"
        `);
    });

    test('should not transform mixins', async () => {
        expect(
            await transform(`
                import {css} from '${PACKAGE_NAME}'

                let variant = 'normal'
                export default css.mixin({
                    color: 'red',
                    ...variant === 'normal' && {
                        color: 'blue',
                    }
                })
            `),
        ).toMatchInlineSnapshot(`
            "import { css } from "taddy";
            import ".cache/taddy/j5kqa5/1dsv92m.taddy.css";
            let variant = 'normal';
            export default css.mixin({
              color: 'red',
              ...(variant === 'normal' && {
                color: 'blue'
              })
            });"
        `);

        expect(getStyles()).toMatchInlineSnapshot(`
            "._1kgt43_2f0x { color: red; }
            ._1kgt43_1svoa { color: blue; }"
        `);
    });

    test('should transform', async () => {
        expect(
            await transform(`
                import {css} from '${PACKAGE_NAME}'

                export default css({color: 'red'})
            `),
        ).toMatchInlineSnapshot(`
            "import { css } from "@taddy/core";
            import ".cache/taddy/j5kqa5/6axrhs.taddy.css";
            export default css(\`_1kgt43_2f0x\`, "__17gkjp6");"
        `);

        expect(getStyles()).toMatchInlineSnapshot(
            `"._1kgt43_2f0x { color: red; }"`,
        );
    });

    test('should transform nested', async () => {
        expect(
            await transform(`
                import {css} from '${PACKAGE_NAME}'

                export default css({
                    color: 'red',
                    ':hover': {
                        color: 'blue',
                    }
                })
            `),
        ).toMatchInlineSnapshot(`
            "import { css } from "@taddy/core";
            import ".cache/taddy/j5kqa5/1sso9tc.taddy.css";
            export default css(\`_1kgt43_2f0x _t3u24i_1kgt43_1svoa\`, "__17gkjp6");"
        `);

        expect(getStyles()).toMatchInlineSnapshot(`
            "._1kgt43_2f0x { color: red; }
            ._t3u24i_1kgt43_1svoa:hover { color: blue; }"
        `);
    });

    test('should transform with dynamic values', async () => {
        expect(
            await transform(`
                import {css} from '${PACKAGE_NAME}'

                let color = 'red'

                export default css({
                    color,
                    ':hover': {
                        color: 'blue',
                    }
                })
            `),
        ).toMatchInlineSnapshot(`
            "import { css } from "@taddy/core";
            import ".cache/taddy/j5kqa5/1sso9tc.taddy.css";
            export default css(\`_1kgt43_2f0x _t3u24i_1kgt43_1svoa\`, "__17gkjp6");"
        `);

        expect(getStyles()).toMatchInlineSnapshot(`
            "._1kgt43_2f0x { color: red; }
            ._t3u24i_1kgt43_1svoa:hover { color: blue; }"
        `);
    });

    test('should transform with className', async () => {
        expect(
            await transform(`
                import {css} from '${PACKAGE_NAME}'

                export default css({
                    className: 'class',

                    color: 'red',
                    ':hover': {
                        color: 'blue',
                    }
                })
            `),
        ).toMatchInlineSnapshot(`
            "import { css } from "@taddy/core";
            import ".cache/taddy/j5kqa5/1sso9tc.taddy.css";
            export default css(\`class _1kgt43_2f0x _t3u24i_1kgt43_1svoa\`, "__17gkjp6");"
        `);

        expect(getStyles()).toMatchInlineSnapshot(`
            "._1kgt43_2f0x { color: red; }
            ._t3u24i_1kgt43_1svoa:hover { color: blue; }"
        `);
    });

    test('should transform with dynamic className', async () => {
        expect(
            await transform(`
                import {css} from '${PACKAGE_NAME}'

                let className = 'class'

                export default css({
                    className,

                    color: 'red',
                    ':hover': {
                        color: 'blue',
                    }
                })
            `),
        ).toMatchInlineSnapshot(`
            "import { css } from "@taddy/core";
            import ".cache/taddy/j5kqa5/1sso9tc.taddy.css";
            export default css(\`class _1kgt43_2f0x _t3u24i_1kgt43_1svoa\`, "__17gkjp6");"
        `);

        expect(getStyles()).toMatchInlineSnapshot(`
            "._1kgt43_2f0x { color: red; }
            ._t3u24i_1kgt43_1svoa:hover { color: blue; }"
        `);
    });

    test('should transform with style', async () => {
        expect(
            await transform(`
                import {css} from '${PACKAGE_NAME}'

                let className = 'class'
                let style = {color: 'green'}

                export default css({
                    className,
                    style,

                    color: 'red',
                    ':hover': {
                        color: 'blue',
                    }
                })
            `),
        ).toMatchInlineSnapshot(`
            "import { css } from "@taddy/core";
            import ".cache/taddy/j5kqa5/1sso9tc.taddy.css";
            export default css(\`class _1kgt43_2f0x _t3u24i_1kgt43_1svoa\`, "__17gkjp6");"
        `);

        expect(getStyles()).toMatchInlineSnapshot(`
            "._1kgt43_2f0x { color: red; }
            ._t3u24i_1kgt43_1svoa:hover { color: blue; }"
        `);
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
            import ".cache/taddy/j5kqa5/1sso9tc.taddy.css";
            export default css(\`class _1kgt43_2f0x _t3u24i_1kgt43_1svoa\`, "__17gkjp6");"
        `);

        expect(getStyles()).toMatchInlineSnapshot(`
            "._1kgt43_2f0x { color: red; }
            ._t3u24i_1kgt43_1svoa:hover { color: blue; }"
        `);
    });
});
