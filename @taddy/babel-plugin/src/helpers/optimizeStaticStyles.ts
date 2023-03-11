import * as t from '@babel/types';

import type {NodePath} from '@babel/traverse';

import {VARS_KEY} from '@taddy/core';

import {getObjectPropertyKey} from './getObjectPropertyKey';

function apply(
    quasis: (string | t.BinaryExpression)[],
): t.BinaryExpression | t.StringLiteral {
    let expr;
    let curr = '';
    for (const v of quasis) {
        if (typeof v === 'string') {
            curr += (curr ? ' ' : '') + v;
            continue;
        }
        if (expr && curr) {
            expr = t.binaryExpression(
                '+',
                expr,
                t.stringLiteral(' ' + curr + ' '),
            );
            expr = t.binaryExpression('+', expr, v);
        } else if (curr) {
            expr = t.binaryExpression('+', t.stringLiteral(curr + ' '), v);
        } else {
            expr = v;
        }

        curr = '';
    }
    if (expr && curr) {
        expr = t.binaryExpression('+', expr, t.stringLiteral(' ' + curr));
    }
    return expr || t.stringLiteral(curr);
}

export function optimizeStaticStyles(path: NodePath<t.ObjectExpression>) {
    // const quasis: string[] = [];
    // const expressions: any[] = [];
    const props: t.ObjectProperty[] = [];

    let quasis: (string | t.BinaryExpression)[] = [];

    for (const propPath of path.get('properties')) {
        if (!propPath.isObjectProperty()) {
            throw new Error('Cant optimize this path');
        }

        const keyPath = (propPath as NodePath<t.ObjectProperty>).get('key');
        const key = getObjectPropertyKey(keyPath);

        if (!key) return;

        const valuePath = (propPath as NodePath<t.ObjectProperty>).get('value');

        if (key === 'className' || key === 'style' || key === VARS_KEY) {
            if (quasis.length) {
                props.push(
                    t.objectProperty(apply(quasis), t.booleanLiteral(true)),
                );
            }

            props.push(propPath.node);
            quasis = [];
            continue;
        }

        // if (key === 'className') {
        //     quasis.push(valuePath.node);
        //     continue;
        // }

        if (valuePath.isStringLiteral()) {
            quasis.push(key + valuePath.node.value);
            continue;
        }

        if (valuePath.isBooleanLiteral()) {
            quasis.push(key);
            continue;
        }

        quasis.push(
            t.binaryExpression(
                '+',
                t.stringLiteral(key),
                valuePath.node as t.Expression,
            ),
        );

        // expressions.push(
        //     t.binaryExpression(
        //         '+',
        //         t.stringLiteral(key),
        //         valuePath.node as t.Expression,
        //     ),
        // );
    }

    if (props.length === 0) {
        path.replaceWith(apply(quasis));

        return;
    }

    if (quasis.length) {
        props.push(t.objectProperty(apply(quasis), t.booleanLiteral(true)));
    }

    path.node.properties = props;
}
