import type {Properties} from 'csstype';

export type SupportedAtRulesNames = 'media' | 'supports' | 'container';
export type SupportedAtRules = `@${SupportedAtRulesNames}`;

/* that could be {[key in SimplePseudos]: TaddyRule}, but there would be problems with autocomplete */
type TaddyRuleBase = Properties & {
    ':-khtml-any-link'?: TaddyRuleBase;
    ':-moz-any-link'?: TaddyRuleBase;
    ':-moz-focusring'?: TaddyRuleBase;
    ':-moz-full-screen'?: TaddyRuleBase;
    ':-moz-placeholder'?: TaddyRuleBase;
    ':-moz-read-only'?: TaddyRuleBase;
    ':-moz-read-write'?: TaddyRuleBase;
    ':-ms-fullscreen'?: TaddyRuleBase;
    ':-ms-input-placeholder'?: TaddyRuleBase;
    ':-webkit-any-link'?: TaddyRuleBase;
    ':-webkit-full-screen'?: TaddyRuleBase;
    '::-moz-placeholder'?: TaddyRuleBase;
    '::-moz-progress-bar'?: TaddyRuleBase;
    '::-moz-range-progress'?: TaddyRuleBase;
    '::-moz-range-thumb'?: TaddyRuleBase;
    '::-moz-range-track'?: TaddyRuleBase;
    '::-moz-selection'?: TaddyRuleBase;
    '::-ms-backdrop'?: TaddyRuleBase;
    '::-ms-browse'?: TaddyRuleBase;
    '::-ms-check'?: TaddyRuleBase;
    '::-ms-clear'?: TaddyRuleBase;
    '::-ms-fill'?: TaddyRuleBase;
    '::-ms-fill-lower'?: TaddyRuleBase;
    '::-ms-fill-upper'?: TaddyRuleBase;
    '::-ms-input-placeholder'?: TaddyRuleBase;
    '::-ms-reveal'?: TaddyRuleBase;
    '::-ms-thumb'?: TaddyRuleBase;
    '::-ms-ticks-after'?: TaddyRuleBase;
    '::-ms-ticks-before'?: TaddyRuleBase;
    '::-ms-tooltip'?: TaddyRuleBase;
    '::-ms-track'?: TaddyRuleBase;
    '::-ms-value'?: TaddyRuleBase;
    '::-webkit-backdrop'?: TaddyRuleBase;
    '::-webkit-input-placeholder'?: TaddyRuleBase;
    '::-webkit-progress-bar'?: TaddyRuleBase;
    '::-webkit-progress-inner-value'?: TaddyRuleBase;
    '::-webkit-progress-value'?: TaddyRuleBase;
    '::-webkit-slider-runnable-track'?: TaddyRuleBase;
    '::-webkit-slider-thumb'?: TaddyRuleBase;
    '::after'?: TaddyRuleBase;
    '::backdrop'?: TaddyRuleBase;
    '::before'?: TaddyRuleBase;
    '::cue'?: TaddyRuleBase;
    '::cue-region'?: TaddyRuleBase;
    '::first-letter'?: TaddyRuleBase;
    '::first-line'?: TaddyRuleBase;
    '::grammar-error'?: TaddyRuleBase;
    '::marker'?: TaddyRuleBase;
    '::placeholder'?: TaddyRuleBase;
    '::selection'?: TaddyRuleBase;
    '::spelling-error'?: TaddyRuleBase;
    ':active'?: TaddyRuleBase;
    ':after'?: TaddyRuleBase;
    ':any-link'?: TaddyRuleBase;
    ':before'?: TaddyRuleBase;
    ':blank'?: TaddyRuleBase;
    ':checked'?: TaddyRuleBase;
    ':default'?: TaddyRuleBase;
    ':defined'?: TaddyRuleBase;
    ':disabled'?: TaddyRuleBase;
    ':empty'?: TaddyRuleBase;
    ':enabled'?: TaddyRuleBase;
    ':first'?: TaddyRuleBase;
    ':first-child'?: TaddyRuleBase;
    ':first-letter'?: TaddyRuleBase;
    ':first-line'?: TaddyRuleBase;
    ':first-of-type'?: TaddyRuleBase;
    ':focus'?: TaddyRuleBase;
    ':focus-visible'?: TaddyRuleBase;
    ':focus-within'?: TaddyRuleBase;
    ':fullscreen'?: TaddyRuleBase;
    ':hover'?: TaddyRuleBase;
    ':in-range'?: TaddyRuleBase;
    ':indeterminate'?: TaddyRuleBase;
    ':invalid'?: TaddyRuleBase;
    ':last-child'?: TaddyRuleBase;
    ':last-of-type'?: TaddyRuleBase;
    ':left'?: TaddyRuleBase;
    ':link'?: TaddyRuleBase;
    ':only-child'?: TaddyRuleBase;
    ':only-of-type'?: TaddyRuleBase;
    ':optional'?: TaddyRuleBase;
    ':out-of-range'?: TaddyRuleBase;
    ':placeholder-shown'?: TaddyRuleBase;
    ':read-only'?: TaddyRuleBase;
    ':read-write'?: TaddyRuleBase;
    ':required'?: TaddyRuleBase;
    ':right'?: TaddyRuleBase;
    ':root'?: TaddyRuleBase;
    ':scope'?: TaddyRuleBase;
    ':target'?: TaddyRuleBase;
    ':valid'?: TaddyRuleBase;
    ':visited'?: TaddyRuleBase;
};

export type TaddyRule = TaddyRuleBase & {
    composes?: object[];
    className?: string;
    style?: object;
} & Partial<{
        [key in SupportedAtRules]: Record<string, TaddyRuleBase>;
    }>;
