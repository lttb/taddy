import {buildAtomicRule} from './common';

import Sheet from './Sheet';
import type {SheetOptions} from './Sheet';

interface VirtualCSSStyleRule extends Partial<CSSStyleRule> {
    $className: string;
    $key: string;
    $value: string;
    $postfix: string;
}

type VirtualCSSConditionRule = Partial<CSSConditionRule>;

export class VirtualStyleSheet extends Sheet {
    cssRules: (VirtualCSSStyleRule | VirtualCSSConditionRule)[];

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

    insertDevRule(rule) {
        this.cssRules.push({
            cssText: rule,
        });
    }

    insertAtomicRule(
        className: string,
        key: string,
        value: string,
        {
            postfix = '',
            atRuleIndex,
        }: {postfix?: string; atRuleIndex?: number} = {},
    ): number {
        const selectorText = `.${className}`;
        const cssText = buildAtomicRule(selectorText, key, value);

        let insertSheet = this.sheet;

        if (atRuleIndex !== undefined) {
            // cast media rule type
            insertSheet = this.sheet.cssRules[
                atRuleIndex
            ] as any as typeof insertSheet;
        }

        const index = insertSheet.cssRules.length;

        insertSheet.cssRules.push({
            cssText,
            selectorText,
            $className: className,
            $key: key,
            $value: value,
            $postfix: postfix,
        });
        return index;
    }

    insertAtRule(key: {name: string; query: string}): number {
        const index = this.sheet.cssRules.length;
        const cssRules = [] as any;
        this.sheet.cssRules.push({
            get cssText() {
                return `${key.name} (${key.query}) {${this.cssRules
                    .map((x) => x.cssText || '')
                    .join('')}}`;
            },
            cssRules,
            conditionText: key.query,
        });
        return index;
    }

    appendSelector(
        ruleIndex: number,
        selector: string,
        {atRuleIndex}: {atRuleIndex?: number} = {},
    ): void {
        let sheet = this.sheet;

        if (atRuleIndex !== undefined) {
            // cast media rule type
            sheet = this.cssRules[atRuleIndex] as any as typeof sheet;
        }

        const rule = sheet.cssRules[ruleIndex] as VirtualCSSStyleRule;

        const selectorText = `${rule.selectorText},${selector}`;
        rule.selectorText = selectorText;
        rule.cssText = buildAtomicRule(selectorText, rule.$key, rule.$value);
    }
}
