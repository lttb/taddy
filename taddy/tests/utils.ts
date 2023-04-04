import {RuleInjector} from '../RuleInjector';
import {getStyleNodeById} from '../RuleInjector/common';

import {$css} from '..';

export function getStyles(): string {
    return Array.from(getStyleNodeById('taddy').sheet?.cssRules || [])
        .map((rule) => rule.cssText)
        .join('\n');
}

export function resetStyles() {
    getStyleNodeById('taddy').remove();

    // @ts-expect-error - fix compiled/source types resolution
    $css.ruleInjector = new RuleInjector();
}
