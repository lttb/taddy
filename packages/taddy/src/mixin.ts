import {MIXIN_KEY} from '@taddy/core';

import {$css, TaddyRule} from './$css';

type TaddyMixin<T> = T;

// The union hack to improve autocomplete
export function mixin<T extends TaddyRule>(rule: TaddyRule | T): TaddyMixin<T>;

export function mixin(rule) {
    rule[MIXIN_KEY] = $css(rule);
    return rule;
}
