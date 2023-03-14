import {expect, describe, beforeEach, beforeAll, it} from '@jest/globals';

import {css, $css, mixin, $} from '.';

import {resetStyles, getStyles} from './utils/tests';

function assertCSS(value, expectedStyles) {
    expect($css(value)).toEqual($css(expectedStyles));
}

describe('api', () => {
    beforeAll(() => {
        // happy-dom at rules doesn't have "insertRule" method
        // TODO: raise an issue to https://github.com/capricorn86/happy-dom
        CSSMediaRule.prototype.insertRule = CSSStyleSheet.prototype.insertRule;
        CSSContainerRule.prototype.insertRule =
            CSSStyleSheet.prototype.insertRule;
        // TODO: add PR with CSSSupportsRule in global
        // CSSSupportsRule.prototype.insertRule = CSSStyleSheet.prototype.insertRule;
    });

    beforeEach(() => {
        resetStyles();
    });

    it('should generate atoms', () => {
        expect(css({color: 'red', background: 'green'})).toMatchInlineSnapshot(`
            {
              "className": "_9bfd_4da4 _932d_16b8 ___49fe",
              Symbol(ID_KEY): "___49fe",
              Symbol(Symbol.toPrimitive): [Function],
            }
        `);

        expect(getStyles()).toMatchInlineSnapshot(`
            "._9bfd_4da4 { color: red; }
            ._932d_16b8 { background: green; }"
        `);
    });

    it('should omit only invalid values', () => {
        expect(
            css({
                color: undefined,
                opacity: 0,
                background: '',
                display: 'flex',
            }),
        ).toMatchInlineSnapshot(`
            {
              "className": "_1fdd_64da _15b0_2efe ___ff7e",
              Symbol(ID_KEY): "___ff7e",
              Symbol(Symbol.toPrimitive): [Function],
            }
        `);

        expect(getStyles()).toMatchInlineSnapshot(`
            "._1fdd_64da { opacity: 0; }
            ._15b0_2efe { display: flex; }"
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
            "._3e02_3da8 { font-weight: bold; }
            ._a1f1_a713 { font-size: medium; }
            ._15b0_2efe { display: flex; }
            ._37f5_d254 { flex-direction: column; }
            ._9bfd_4da4 { color: red; }
            ._932d_16b8 { background: green; }
            ._3e02_2555 { font-weight: normal; }"
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
            "._3e02_3da8 { font-weight: bold; }
            ._a1f1_a713 { font-size: medium; }
            ._15b0_2efe { display: flex; }
            ._37f5_d254 { flex-direction: column; }
            ._9bfd_4da4 { color: red; }
            ._932d_16b8 { background: green; }
            ._2421_b2f4 { padding: 10px; }"
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
            "._3e02_3da8 { font-weight: bold; }
            ._a1f1_a713 { font-size: medium; }
            ._69bc_9bfd_4da4:hover,._9bfd_4da4 { color: red; }
            ._15b0_2efe { display: flex; }
            ._37f5_d254 { flex-direction: column; }
            ._69bc_932d_16b8:hover,._932d_16b8 { background: green; }"
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
            "._3e02_3da8 { font-weight: bold; }
            ._a1f1_a713 { font-size: medium; }
            ._3e02_2555 { font-weight: normal; }
            ._15b0_2efe { display: flex; }
            ._37f5_d254 { flex-direction: column; }
            ._9bfd_4da4 { color: red; }
            ._932d_16b8 { background: green; }
            ._2421_64da { padding: 0px; }
            ._2421_b2f4 { padding: 10px; }
            ._3e02_8cc9 { font-weight: initial; }"
        `);
    });

    it('should work with complex selectors', () => {
        const button = css({color: 'red'});
        const box = css({
            color: 'blue',
            [$` + ${button}`]: {marginLeft: '10px'},
        });

        expect(button).toMatchInlineSnapshot(`
            {
              "className": "_9bfd_4da4 ___cc1b",
              Symbol(ID_KEY): "___cc1b",
              Symbol(Symbol.toPrimitive): [Function],
            }
        `);

        expect(box).toMatchInlineSnapshot(`
            {
              "className": "_9bfd_0c8f _cb51_c9cd_b2f4 ___56ac",
              Symbol(ID_KEY): "___56ac",
              Symbol(Symbol.toPrimitive): [Function],
            }
        `);

        expect(getStyles()).toMatchInlineSnapshot(`
            "._9bfd_4da4 { color: red; }
            ._9bfd_0c8f { color: blue; }
            ._cb51_c9cd_b2f4 + .___cc1b { margin-left: 10px; }"
        `);
    });

    it('should merge declarations', () => {
        const elem = css({color: 'red', background: 'blue'}, '__id1');

        expect(
            css(
                {
                    ...elem,
                    color: 'blue',
                },
                '__id2',
            ).className,
        ).toEqual(
            css(
                {
                    color: 'blue',
                    background: 'blue',
                },
                '__id1 __id2',
            ).className,
        );

        expect(
            css(
                {
                    color: 'blue',
                    ...elem,
                },
                '__id2',
            ).className,
        ).toEqual(
            css(
                {
                    color: 'red',
                    background: 'blue',
                },
                '__id1 __id2',
            ).className,
        );
    });

    it('should work with @media', () => {
        const button = css({
            color: 'blue',
            '@media': ['min-width: 100px', {color: 'red'}],
        });

        expect(button).toMatchInlineSnapshot(`
            {
              "className": "_9bfd_0c8f _e293_6219_9bfd_4da4 ___423f",
              Symbol(ID_KEY): "___423f",
              Symbol(Symbol.toPrimitive): [Function],
            }
        `);

        expect(getStyles()).toMatchInlineSnapshot(`
            "._9bfd_0c8f { color: blue; }
            @media (min-width: 100px) { ._e293_6219_9bfd_4da4 { color: red; } }"
        `);
    });

    it('should work with @container', () => {
        const button = css({
            color: 'blue',
            '@container': ['min-width: 100px', {color: 'red'}],
        });

        expect(button).toMatchInlineSnapshot(`
            {
              "className": "_9bfd_0c8f _98fb_6219_9bfd_4da4 ___6a39",
              Symbol(ID_KEY): "___6a39",
              Symbol(Symbol.toPrimitive): [Function],
            }
        `);

        expect(getStyles()).toMatchInlineSnapshot(`
            "._9bfd_0c8f { color: blue; }
            @container (min-width: 100px) { ._98fb_6219_9bfd_4da4 { color: red; } }"
        `);
    });

    // skipped for now, CSSSupportsRule should be available in global for prototyping
    it.skip('should work with @support', () => {
        const button = css({
            color: 'blue',
            '@supports': ['display: flex', {color: 'red'}],
        });

        expect(button).toMatchInlineSnapshot(`
            {
              "className": "_9bfd_0c8f _2ca5_7d97_9bfd_4da4 ___4d89",
              Symbol(ID_KEY): "___4d89",
              Symbol(Symbol.toPrimitive): [Function],
            }
        `);

        expect(getStyles()).toMatchInlineSnapshot(`
            "._9bfd_0c8f { color: blue; }
            @supports (display: flex) { ._2ca5_7d97_9bfd_4da4 { color: red; } }"
        `);
    });
});
