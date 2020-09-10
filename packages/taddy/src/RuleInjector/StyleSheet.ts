import {buildAtomicRule, getStyleNodeById} from './common';

import Sheet from './Sheet';
import type {SheetOptions} from './Sheet';

export class StyleSheet extends Sheet {
    node: HTMLStyleElement;

    sheet: CSSStyleSheet;

    cssRules: CSSRuleList;

    initialNode: HTMLStyleElement;

    classNameNode: HTMLStyleElement;

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

    insertAtomicRule(className: string, key: string, value: string): number {
        if (this.isRuleExists(className, key)) {
            return -1;
        }

        const selectorText = `.${className}`;
        const cssText = buildAtomicRule(selectorText, key, value);

        return this.sheet.insertRule(cssText, this.cssRules.length);
    }

    appendSelector(ruleIndex: number, selector: string): void {
        (this.cssRules[
            ruleIndex
        ] as CSSStyleRule).selectorText += `,${selector}`;
    }
}
