import {PACKAGE_NAME, transform, getStyles, resetStyles} from './common';

describe('taddy.macro.static', () => {
    beforeEach(() => {
        resetStyles();
    });

    test('should not transform spreads', async () => {
        expect(
            await transform(`
                import {css} from '${PACKAGE_NAME}'

                let variant = 'normal'
                export default css({
                    color: 'red',
                    ...variant === 'normal' && {
                        color: 'black',
                    }
                })
            `),
        ).toMatchInlineSnapshot(`
            "import \\".cache/taddy/entry.js\\";
            import { css } from \\"taddy\\";
            let variant = 'normal';
            export default css({
              _9bfd: \\"_4da4\\",
              ...(variant === 'normal' && {
                _9bfd: \\"_ac89\\"
              })
            });"
        `);

        expect(getStyles()).toMatchInlineSnapshot(`
            "._9bfd_4da4 {color: red;}
            ._9bfd_ac89 {color: black;}"
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
                        color: 'black',
                    }
                })
            `),
        ).toMatchInlineSnapshot(`
            "import \\".cache/taddy/entry.js\\";
            import { css } from \\"@taddy/core\\";
            let variant = 'normal';
            export default css.mixin({
              _9bfd: \\"_4da4\\",
              ...(variant === 'normal' && {
                _9bfd: \\"_ac89\\"
              })
            });"
        `);

        expect(getStyles()).toMatchInlineSnapshot(`
            "._9bfd_4da4 {color: red;}
            ._9bfd_ac89 {color: black;}"
        `);
    });

    test('should transform', async () => {
        expect(
            await transform(`
                import {css} from '${PACKAGE_NAME}'

                export default css({color: 'red'})
            `),
        ).toMatchInlineSnapshot(`
            "import \\".cache/taddy/entry.js\\";
            import { css } from \\"@taddy/core\\";
            export default css(\\"_9bfd_4da4\\");"
        `);

        expect(getStyles()).toMatchInlineSnapshot(
            `"._9bfd_4da4 {color: red;}"`,
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
            "import \\".cache/taddy/entry.js\\";
            import { css } from \\"@taddy/core\\";
            export default css(\\"_9bfd_4da4 _69bc_9bfd_0c8f\\");"
        `);

        expect(getStyles()).toMatchInlineSnapshot(`
            "._9bfd_4da4 {color: red;}
            ._69bc_9bfd_0c8f:hover {color: blue;}"
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
            "import \\".cache/taddy/entry.js\\";
            import { css } from \\"@taddy/core\\";
            let color = 'red';
            export default css({
              __VARS__: {
                \\"--_9bfd\\": color
              },
              className: \\"_9bfd_5daa _69bc_9bfd_0c8f\\"
            });"
        `);

        expect(getStyles()).toMatchInlineSnapshot(`
            "._9bfd_5daa {color: var(--_9bfd);}
            ._69bc_9bfd_0c8f:hover {color: blue;}"
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
            "import \\".cache/taddy/entry.js\\";
            import { css } from \\"@taddy/core\\";
            export default css(\\"_9bfd_4da4 _69bc_9bfd_0c8f \\" + 'class');"
        `);

        expect(getStyles()).toMatchInlineSnapshot(`
            "._9bfd_4da4 {color: red;}
            ._69bc_9bfd_0c8f:hover {color: blue;}"
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
            "import \\".cache/taddy/entry.js\\";
            import { css } from \\"@taddy/core\\";
            let className = 'class';
            export default css(\\"_9bfd_4da4 _69bc_9bfd_0c8f \\" + className);"
        `);

        expect(getStyles()).toMatchInlineSnapshot(`
            "._9bfd_4da4 {color: red;}
            ._69bc_9bfd_0c8f:hover {color: blue;}"
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
            "import \\".cache/taddy/entry.js\\";
            import { css } from \\"@taddy/core\\";
            let className = 'class';
            let style = {
              color: 'green'
            };
            export default css({
              style,
              className: \\"_9bfd_4da4 _69bc_9bfd_0c8f \\" + className
            });"
        `);

        expect(getStyles()).toMatchInlineSnapshot(`
            "._9bfd_4da4 {color: red;}
            ._69bc_9bfd_0c8f:hover {color: blue;}"
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
            "import \\".cache/taddy/entry.js\\";
            import { css } from \\"@taddy/core\\";
            let className = 'class';
            let style = {
              color: 'green'
            };
            let color = 'red';
            export default css({
              style,
              __VARS__: {
                \\"--_9bfd\\": color
              },
              className: \\"_9bfd_5daa _69bc_9bfd_0c8f \\" + className
            });"
        `);

        expect(getStyles()).toMatchInlineSnapshot(`
            "._9bfd_5daa {color: var(--_9bfd);}
            ._69bc_9bfd_0c8f:hover {color: blue;}"
        `);
    });
});
