import {buildAtomicRule, getStyleNodeById} from './common';

import Sheet from './Sheet';
import type {SheetOptions} from './Sheet';

export class StyleSheet extends Sheet {
    node: HTMLStyleElement;

    sheet: CSSStyleSheet;

    cssRules: CSSRuleList;

    initialNode: HTMLStyleElement;

    classNameNode: HTMLStyleElement;

    devNode?: HTMLStyleElement;

    initialStyle: CSSStyleDeclaration;

    headStyle: CSSStyleDeclaration;

    static TADDY_ID = 'taddy';

    constructor(options?: SheetOptions) {
        super(options);

        const node = getStyleNodeById(StyleSheet.TADDY_ID);

        this.node = node;

        if (!node.sheet) {
            throw new Error(
                '[TaddyRuleInjector]: there is no taddy stylesheet',
            );
        }

        this.sheet = node.sheet;
        this.cssRules = this.sheet.cssRules;

        this.classNameNode = getStyleNodeById(`${StyleSheet.TADDY_ID}-class`);
        // hack to reset default browser styles
        this.classNameNode.style.display = 'initial';

        this.initialNode = getStyleNodeById(`${StyleSheet.TADDY_ID}-initial`);
        // hack to be interoperable with js-cssom
        this.initialNode.style.display = 'initial';
        this.initialNode.style.all = 'initial';

        this.initialStyle = window.getComputedStyle(this.initialNode);

        this.headStyle = window.getComputedStyle(document.head);

        // TODO: split production and development builds
        if (process.env.NODE_ENV !== 'production') {
            this.devNode = getStyleNodeById(`${StyleSheet.TADDY_ID}-dev`);
        }
    }

    get rules() {
        const rules: CSSRule[] = [];
        for (let i = 0; i < this.cssRules.length; i++) {
            rules.push(this.cssRules[i]);
        }
        return rules;
    }

    /**
     * There are different approaches to detect the existing classname with different tradeoffs.
     * At the moment, this one looks reasonable.
     * But there is still a potential conflict with the same
     * style on html node and element
     */
    private isRuleExists(className: string, key: string): boolean {
        this.classNameNode.className = className;
        const value: string | void = window.getComputedStyle(
            this.classNameNode,
        )[key];
        this.classNameNode.className = '';

        return (
            value !== this.initialStyle[key] && value !== this.headStyle[key]
        );
    }

    insertDevRule(rule) {
        if (!this.devNode) return;

        this.devNode.appendChild(document.createTextNode(rule));
    }

    insertAtomicRule(
        className: string,
        key: string,
        value: string,
        {atRuleIndex}: {atRuleIndex?: number} = {},
    ): number {
        if (this.isRuleExists(className, key)) {
            return -1;
        }

        const selectorText = `.${className}`;
        const cssText = buildAtomicRule(selectorText, key, value);

        let insertSheet = this.sheet;

        if (atRuleIndex !== undefined) {
            // cast at rule type
            insertSheet = this.cssRules[
                atRuleIndex
            ] as any as typeof insertSheet;
        }

        return insertSheet.insertRule(cssText, insertSheet.cssRules.length);
    }

    insertAtRule(key: {name: string; query: string}) {
        return this.sheet.insertRule(
            `${key.name} (${key.query}) {}`,
            this.cssRules.length,
        );
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

        const rule = sheet.cssRules[ruleIndex] as CSSStyleRule;

        rule.selectorText += `,${selector}`;
    }
}
