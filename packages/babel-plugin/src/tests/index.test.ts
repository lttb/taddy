import {PACKAGE_NAME, transform, getStyles, resetStyles} from './common';

describe('taddy.macro', () => {
    beforeEach(() => {
        resetStyles();
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
            "import { css } from \\"@taddy/core\\";
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
