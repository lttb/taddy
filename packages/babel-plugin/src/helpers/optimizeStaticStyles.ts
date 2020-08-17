import * as t from '@babel/types';
import assert from 'assert';

import type {NodePath} from '@babel/traverse';

import {VARS_KEY} from '@taddy/core';

import {getObjectPropertyKey} from './getObjectPropertyKey';

export function optimizeStaticStyles(path: NodePath<t.ObjectExpression>) {
    const quasis: string[] = [];
    const expressions: any[] = [];
    const props: t.ObjectProperty[] = [];

    for (const propPath of path.get('properties')) {
        if (!propPath.isObjectProperty()) {
            throw new Error('Cant optimize this path');
        }

        const key = String(getObjectPropertyKey(propPath));

        assert(key);

        const valuePath = (propPath as NodePath<t.ObjectProperty>).get('value');

        if (key === 'className') {
            expressions.push(valuePath.node);
            continue;
        }

        if (key === 'style' || key === VARS_KEY) {
            props.push(propPath.node);
            continue;
        }

        if (valuePath.isStringLiteral()) {
            quasis.push(key + valuePath.node.value);
            continue;
        }

        if (valuePath.isBooleanLiteral()) {
            quasis.push(key);
            continue;
        }

        expressions.push(
            t.binaryExpression(
                '+',
                t.stringLiteral(key),
                valuePath.node as t.Expression,
            ),
        );
    }

    let classes: t.StringLiteral | t.BinaryExpression = t.stringLiteral(
        quasis.join(' '),
    );

    if (expressions.length !== 0) {
        classes.value += classes.value ? ' ' : '';

        const left = classes;
        const right =
            expressions.length === 1
                ? expressions[0]
                : t.templateLiteral(
                      [t.templateElement({raw: ''})]
                          .concat(
                              [...Array(expressions.length - 1)].fill(
                                  t.templateElement({raw: ' '}),
                              ),
                          )
                          .concat(t.templateElement({raw: ''})),
                      expressions,
                  );
        classes = t.binaryExpression('+', left, right);
    }

    if (props.length === 0) {
        path.replaceWith(classes);
        return;
    }

    path.node.properties = props.concat(
        t.objectProperty(t.identifier('className'), classes),
    );
}
