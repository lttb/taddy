import type {Properties} from 'csstype';

export type SupportedAtRulesNames = 'media' | 'supports' | 'container';
export type SupportedAtRules = `@${SupportedAtRulesNames}`;

export type TaddyRule = Properties & {
    composes?: object[];
    className?: string;
    style?: object;
} & Partial<{
        [key in SupportedAtRules]: Record<string, TaddyRule>;
    }> & /* that could be {[key in SimplePseudos]: TaddyRule}, but there would be problems with autocomplete */ {
        ':-khtml-any-link'?: TaddyRule;
        ':-moz-any-link'?: TaddyRule;
        ':-moz-focusring'?: TaddyRule;
        ':-moz-full-screen'?: TaddyRule;
        ':-moz-placeholder'?: TaddyRule;
        ':-moz-read-only'?: TaddyRule;
        ':-moz-read-write'?: TaddyRule;
        ':-ms-fullscreen'?: TaddyRule;
        ':-ms-input-placeholder'?: TaddyRule;
        ':-webkit-any-link'?: TaddyRule;
        ':-webkit-full-screen'?: TaddyRule;
        '::-moz-placeholder'?: TaddyRule;
        '::-moz-progress-bar'?: TaddyRule;
        '::-moz-range-progress'?: TaddyRule;
        '::-moz-range-thumb'?: TaddyRule;
        '::-moz-range-track'?: TaddyRule;
        '::-moz-selection'?: TaddyRule;
        '::-ms-backdrop'?: TaddyRule;
        '::-ms-browse'?: TaddyRule;
        '::-ms-check'?: TaddyRule;
        '::-ms-clear'?: TaddyRule;
        '::-ms-fill'?: TaddyRule;
        '::-ms-fill-lower'?: TaddyRule;
        '::-ms-fill-upper'?: TaddyRule;
        '::-ms-input-placeholder'?: TaddyRule;
        '::-ms-reveal'?: TaddyRule;
        '::-ms-thumb'?: TaddyRule;
        '::-ms-ticks-after'?: TaddyRule;
        '::-ms-ticks-before'?: TaddyRule;
        '::-ms-tooltip'?: TaddyRule;
        '::-ms-track'?: TaddyRule;
        '::-ms-value'?: TaddyRule;
        '::-webkit-backdrop'?: TaddyRule;
        '::-webkit-input-placeholder'?: TaddyRule;
        '::-webkit-progress-bar'?: TaddyRule;
        '::-webkit-progress-inner-value'?: TaddyRule;
        '::-webkit-progress-value'?: TaddyRule;
        '::-webkit-slider-runnable-track'?: TaddyRule;
        '::-webkit-slider-thumb'?: TaddyRule;
        '::after'?: TaddyRule;
        '::backdrop'?: TaddyRule;
        '::before'?: TaddyRule;
        '::cue'?: TaddyRule;
        '::cue-region'?: TaddyRule;
        '::first-letter'?: TaddyRule;
        '::first-line'?: TaddyRule;
        '::grammar-error'?: TaddyRule;
        '::marker'?: TaddyRule;
        '::placeholder'?: TaddyRule;
        '::selection'?: TaddyRule;
        '::spelling-error'?: TaddyRule;
        ':active'?: TaddyRule;
        ':after'?: TaddyRule;
        ':any-link'?: TaddyRule;
        ':before'?: TaddyRule;
        ':blank'?: TaddyRule;
        ':checked'?: TaddyRule;
        ':default'?: TaddyRule;
        ':defined'?: TaddyRule;
        ':disabled'?: TaddyRule;
        ':empty'?: TaddyRule;
        ':enabled'?: TaddyRule;
        ':first'?: TaddyRule;
        ':first-child'?: TaddyRule;
        ':first-letter'?: TaddyRule;
        ':first-line'?: TaddyRule;
        ':first-of-type'?: TaddyRule;
        ':focus'?: TaddyRule;
        ':focus-visible'?: TaddyRule;
        ':focus-within'?: TaddyRule;
        ':fullscreen'?: TaddyRule;
        ':hover'?: TaddyRule;
        ':in-range'?: TaddyRule;
        ':indeterminate'?: TaddyRule;
        ':invalid'?: TaddyRule;
        ':last-child'?: TaddyRule;
        ':last-of-type'?: TaddyRule;
        ':left'?: TaddyRule;
        ':link'?: TaddyRule;
        ':only-child'?: TaddyRule;
        ':only-of-type'?: TaddyRule;
        ':optional'?: TaddyRule;
        ':out-of-range'?: TaddyRule;
        ':placeholder-shown'?: TaddyRule;
        ':read-only'?: TaddyRule;
        ':read-write'?: TaddyRule;
        ':required'?: TaddyRule;
        ':right'?: TaddyRule;
        ':root'?: TaddyRule;
        ':scope'?: TaddyRule;
        ':target'?: TaddyRule;
        ':valid'?: TaddyRule;
        ':visited'?: TaddyRule;
    };
