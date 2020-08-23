import {buildAtomicRule, Sheet} from './common';

interface VirtualCSSStyleRule extends Partial<CSSStyleRule> {
    $className: string;
    $key: string;
    $value: string;
}

export class VirtualStyleSheet implements Sheet {
    cssRules: VirtualCSSStyleRule[];

    sheet: {cssRules: VirtualStyleSheet['cssRules']};

    cache: {[key: string]: true};

    constructor() {
        this.sheet = {
            cssRules: [],
        };
        this.cssRules = this.sheet.cssRules;

        this.cache = {};
    }

    get rules() {
        return this.cssRules;
    }

    isRuleExists(className: string, key: string): boolean {
        return !!this.cache[className];
    }

    insertAtomicRule(className: string, key: string, value: string): number {
        if (this.isRuleExists(className, key)) {
            return -1;
        }

        this.cache[className] = true;

        const selectorText = `.${className}`;
        const index = this.sheet.cssRules.length;
        const cssText = buildAtomicRule(selectorText, key, value);
        this.sheet.cssRules.push({
            cssText,
            selectorText,
            $className: className,
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
