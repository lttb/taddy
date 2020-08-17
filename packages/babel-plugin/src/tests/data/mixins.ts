import {css} from 'taddy';

export const box = css.mixin({fontWeight: 'bold'});

export const typo = css.mixin({lineHeight: 1, ':hover': {color: 'red'}});
