import {buildAtomicRule, Sheet} from './common';

interface VirtualCSSStyleRule extends Partial<CSSStyleRule> {
    $key: string;
    $value: string;
}

export class VirtualStyleSheet implements Sheet {
    cssRules: VirtualCSSStyleRule[];

    sheet: {cssRules: VirtualStyleSheet['cssRules']};

    constructor() {
        this.sheet = {
            cssRules: [],
        };
        this.cssRules = this.sheet.cssRules;
    }

    get rules() {
        return this.cssRules;
    }

    insertAtomicRule(className: string, key: string, value: string): number {
        const selectorText = `.${className}`;
        const index = this.sheet.cssRules.length;
        const cssText = buildAtomicRule(selectorText, key, value);
        this.sheet.cssRules.push({
            cssText,
            selectorText,
            $key: key,
            $value: value,
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
