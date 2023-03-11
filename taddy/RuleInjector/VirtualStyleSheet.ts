import {buildAtomicRule} from './common';

import Sheet from './Sheet';
import type {SheetOptions} from './Sheet';

const MEDIA_RULE_TYPE = 4;

interface VirtualCSSStyleRule extends Partial<CSSStyleRule> {
    $className: string;
    $key: string;
    $value: string;
    $postfix: string;
}

interface VirtualCSSMediaRule extends Partial<CSSMediaRule> {}

export class VirtualStyleSheet extends Sheet {
    cssRules: (VirtualCSSStyleRule | VirtualCSSMediaRule)[];

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
            mediaIndex,
        }: {postfix?: string; mediaIndex?: number} = {},
    ): number {
        const selectorText = `.${className}`;
        const cssText = buildAtomicRule(selectorText, key, value);

        let insertSheet = this.sheet;

        if (mediaIndex !== undefined) {
            // cast media rule type
            insertSheet = (this.sheet.cssRules[
                mediaIndex
            ] as any) as typeof insertSheet;

            console.log({insertSheet});
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

    insertMedia(conditionText: string): number {
        const index = this.sheet.cssRules.length;
        const cssRules = [] as any;
        this.sheet.cssRules.push({
            get cssText() {
                return `@media ${conditionText} {${this.cssRules
                    .map((x) => x.cssText || '')
                    .join('')}}`;
            },
            conditionText,
            cssRules,
            type: MEDIA_RULE_TYPE,
        });
        return index;
    }

    appendSelector(
        ruleIndex: number,
        selector: string,
        {mediaIndex}: {mediaIndex?: number} = {},
    ): void {
        let sheet = this.sheet;

        if (mediaIndex !== undefined) {
            // cast media rule type
            sheet = (this.cssRules[mediaIndex] as any) as typeof sheet;
        }

        let rule = sheet.cssRules[ruleIndex] as VirtualCSSStyleRule;

        const selectorText = `${rule.selectorText},${selector}`;
        rule.selectorText = selectorText;
        rule.cssText = buildAtomicRule(selectorText, rule.$key, rule.$value);
    }
}
