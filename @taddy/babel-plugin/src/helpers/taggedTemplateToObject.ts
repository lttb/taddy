import {types as t} from '@babel/core';
import type {NodePath} from '@babel/traverse';

export function taggedTemplateToObject(
    path: NodePath<t.TaggedTemplateExpression>,
): t.ObjectExpression {
    const postcss = require('postcss');
    const postcssJS = require('postcss-js');
    const {quasis, expressions} = path.node.quasi;

    type Expression = typeof expressions[number];

    const cache: {[placeholder: string]: Expression} = {};

    // this tricky placeholder has special syntax to avoid any conflicts with css parsing
    const re = /@\^var__\w+__/;
    const getPlaceholder = (index) => `@^var__${index}__`;

    let pseudoCSS = '';
    for (let i = 0; i < quasis.length; i++) {
        pseudoCSS += quasis[i].value.raw;
        if (expressions[i]) {
            const placeholder = getPlaceholder(i);
            cache[placeholder] = expressions[i];
            pseudoCSS += placeholder;
        }
    }

    const root = postcss.parse(pseudoCSS);
    const CSSObject = postcssJS.objectify(root);

    function parseString(str) {
        const expr: Expression[] = [];
        str.replace(new RegExp(re, 'g'), (match) => {
            expr.push(cache[match]);
        });

        if (expr.length === 0) {
            return t.stringLiteral(str);
        }

        return t.templateLiteral(
            str.split(re).map((q) => t.templateElement({raw: q, cooked: q})),
            expr,
        );
    }

    function traverse(obj: object): t.ObjectExpression {
        const props: t.ObjectExpression['properties'] = [];

        for (const key in obj) {
            const value = obj[key];

            if (value === true) {
                props.push(t.spreadElement(cache[key] as t.Expression));

                continue;
            }

            const cssKey = key.replace(/^&/, '');

            const keyNode = parseString(cssKey);
            let valueNode;

            if (typeof value === 'object') {
                valueNode = traverse(value);
            } else {
                valueNode = parseString(String(value));
            }

            props.push(
                t.objectProperty(
                    keyNode,
                    valueNode,
                    !t.isStringLiteral(keyNode),
                ),
            );
        }

        return t.objectExpression(props);
    }

    return traverse(CSSObject);
}
