import {css, $css, mixin, $} from '.';

import {resetStyles, getStyles} from './utils/tests';

function assertCSS(value, expectedStyles) {
    expect($css(value)).toEqual($css(expectedStyles));
}

describe('api', () => {
    beforeEach(() => {
        resetStyles();
    });

    it('should generate atoms', () => {
        expect(css({color: 'red', background: 'green'})).toMatchInlineSnapshot(`
            Object {
              "className": "_9bfd_4da4 _932d_16b8 ___49fe",
              "style": undefined,
              Symbol(ID_KEY): "___49fe",
              Symbol(Symbol.toPrimitive): [Function],
            }
        `);

        expect(getStyles()).toMatchInlineSnapshot(`
            "._9bfd_4da4 {color: red;}
            ._932d_16b8 {background: green;}"
        `);
    });

    it('should merge mixins', () => {
        const typo = mixin({fontWeight: 'bold', fontSize: 'medium'});
        const box = mixin({display: 'flex', flexDirection: 'column'});

        assertCSS(
            {color: 'red', background: 'green', ...typo, ...box},
            {
                color: 'red',
                background: 'green',
                fontSize: 'medium',
                display: 'flex',
                flexDirection: 'column',
                fontWeight: 'bold',
            },
        );

        assertCSS(
            {
                color: 'red',
                background: 'green',
                ...typo,
                ...box,
                fontWeight: 'normal',
            },
            {
                color: 'red',
                background: 'green',
                fontSize: 'medium',
                display: 'flex',
                flexDirection: 'column',
                fontWeight: 'normal',
            },
        );

        expect(getStyles()).toMatchInlineSnapshot(`
            "._3e02_3da8 {font-weight: bold;}
            ._a1f1_a713 {font-size: medium;}
            ._15b0_2efe {display: flex;}
            ._37f5_d254 {flex-direction: column;}
            ._9bfd_4da4 {color: red;}
            ._932d_16b8 {background: green;}
            ._3e02_2555 {font-weight: normal;}"
        `);
    });

    it('should compose mixins', () => {
        const typo = mixin({fontWeight: 'bold', fontSize: 'medium'});
        const box = mixin({display: 'flex', flexDirection: 'column'});

        assertCSS(
            {
                color: 'red',
                background: 'green',
                composes: [typo, box, {padding: '10px'}],
            },
            {
                color: 'red',
                background: 'green',
                fontWeight: 'bold',
                fontSize: 'medium',
                display: 'flex',
                flexDirection: 'column',
                padding: '10px',
            },
        );

        expect(getStyles()).toMatchInlineSnapshot(`
            "._3e02_3da8 {font-weight: bold;}
            ._a1f1_a713 {font-size: medium;}
            ._15b0_2efe {display: flex;}
            ._37f5_d254 {flex-direction: column;}
            ._9bfd_4da4 {color: red;}
            ._932d_16b8 {background: green;}
            ._2421_b2f4 {padding: 10px;}"
        `);
    });

    it('should compose mixins with pseudo', () => {
        const typo = mixin({
            fontWeight: 'bold',
            fontSize: 'medium',
            ':hover': {color: 'red'},
        });
        const box = mixin({
            display: 'flex',
            flexDirection: 'column',
            ':hover': {background: 'green'},
        });

        assertCSS(
            {color: 'red', background: 'green', composes: [typo, box]},
            {
                color: 'red',
                background: 'green',
                fontWeight: 'bold',
                fontSize: 'medium',
                display: 'flex',
                flexDirection: 'column',
                ':hover': {color: 'red', background: 'green'},
            },
        );

        expect(getStyles()).toMatchInlineSnapshot(`
            "._3e02_3da8 {font-weight: bold;}
            ._a1f1_a713 {font-size: medium;}
            ._69bc_9bfd_4da4:hover,._9bfd_4da4 {color: red;}
            ._15b0_2efe {display: flex;}
            ._37f5_d254 {flex-direction: column;}
            ._69bc_932d_16b8:hover,._932d_16b8 {background: green;}"
        `);
    });

    it('should override props in composition', () => {
        const typo = mixin({fontWeight: 'bold', fontSize: 'medium'});
        const box = mixin({
            fontWeight: 'normal',
            display: 'flex',
            flexDirection: 'column',
        });

        assertCSS(
            {
                color: 'red',
                background: 'green',
                padding: '0',
                composes: [typo, box, {padding: '10px'}],
            },
            {
                color: 'red',
                background: 'green',
                fontSize: 'medium',
                display: 'flex',
                flexDirection: 'column',
                fontWeight: 'normal',
                padding: '10px',
            },
        );

        assertCSS(
            {
                color: 'red',
                background: 'green',
                fontWeight: 'initial',
                composes: [box, typo],
            },
            {
                color: 'red',
                background: 'green',
                display: 'flex',
                flexDirection: 'column',
                fontSize: 'medium',
                fontWeight: 'bold',
            },
        );

        assertCSS(
            {
                color: 'red',
                background: 'green',
                composes: [box, typo],
                fontWeight: 'initial',
            },
            {
                color: 'red',
                background: 'green',
                display: 'flex',
                flexDirection: 'column',
                fontSize: 'medium',
                fontWeight: 'initial',
            },
        );

        expect(getStyles()).toMatchInlineSnapshot(`
            "._3e02_3da8 {font-weight: bold;}
            ._a1f1_a713 {font-size: medium;}
            ._3e02_2555 {font-weight: normal;}
            ._15b0_2efe {display: flex;}
            ._37f5_d254 {flex-direction: column;}
            ._9bfd_4da4 {color: red;}
            ._932d_16b8 {background: green;}
            ._2421_64da {padding: 0;}
            ._2421_b2f4 {padding: 10px;}
            ._3e02_8cc9 {font-weight: initial;}"
        `);
    });

    it('should work with complex selectors', () => {
        const button = css({color: 'red'});
        const box = css({
            color: 'blue',
            [$` + ${button}`]: {marginLeft: '10px'},
        });

        expect(button).toMatchInlineSnapshot(`
            Object {
              "className": "_9bfd_4da4 ___cc1b",
              "style": undefined,
              Symbol(ID_KEY): "___cc1b",
              Symbol(Symbol.toPrimitive): [Function],
            }
        `);

        expect(box).toMatchInlineSnapshot(`
            Object {
              "className": "_9bfd_0c8f _cb51_c9cd_b2f4 ___56ac",
              "style": undefined,
              Symbol(ID_KEY): "___56ac",
              Symbol(Symbol.toPrimitive): [Function],
            }
        `);

        expect(getStyles()).toMatchInlineSnapshot(`
            "._9bfd_4da4 {color: red;}
            ._9bfd_0c8f {color: blue;}
            ._cb51_c9cd_b2f4 + .___cc1b {margin-left: 10px;}"
        `);
    });
});
