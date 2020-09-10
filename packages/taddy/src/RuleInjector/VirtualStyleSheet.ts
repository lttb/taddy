import {buildAtomicRule} from './common';

import Sheet from './Sheet';
import type {SheetOptions} from './Sheet';

interface VirtualCSSStyleRule extends Partial<CSSStyleRule> {
    $className: string;
    $key: string;
    $value: string;
    $postfix: string;
}

export class VirtualStyleSheet extends Sheet {
    cssRules: VirtualCSSStyleRule[];

    sheet: {cssRules: VirtualStyleSheet['cssRules']};

    constructor(options?: SheetOptions) {
        super(options);

        this.sheet = {
            cssRules: [],
        };
        this.cssRules = this.sheet.cssRules;
    }

    get rules() {
        return this.cssRules;
    }

    insertAtomicRule(
        className: string,
        key: string,
        value: string,
        {postfix = ''},
    ): number {
        const selectorText = `.${className}`;
        const index = this.sheet.cssRules.length;
        const cssText = buildAtomicRule(selectorText, key, value);
        this.sheet.cssRules.push({
            cssText,
            selectorText,
            $className: className,
            $key: key,
            $value: value,
            $postfix: postfix,
        });
        return index;
    }

    appendSelector(ruleIndex: number, selector: string): void {
        const rule = this.sheet.cssRules[ruleIndex];
        const selectorText = `${rule.selectorText},${selector}`;
        rule.selectorText = selectorText;
        rule.cssText = buildAtomicRule(selectorText, rule.$key, rule.$value);
    }
}
