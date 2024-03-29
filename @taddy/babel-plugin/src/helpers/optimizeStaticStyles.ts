import * as t from '@babel/types';

import type {NodePath} from '@babel/traverse';

import {VARS_KEY} from '@taddy/core';

import {getObjectPropertyKey} from './getObjectPropertyKey';

export function optimizeStaticStyles(path: NodePath<t.ObjectExpression>) {
    const props: t.ObjectProperty[] = [];

    let quasis: t.TemplateElement[] = [];
    let expressions: t.Expression[] = [];

    let currQuasi = '';

    for (const propPath of path.get('properties')) {
        if (!propPath.isObjectProperty()) {
            throw new Error('Cant optimize this path');
        }

        const keyPath = (propPath as NodePath<t.ObjectProperty>).get('key');
        const key = getObjectPropertyKey(keyPath);

        if (!key) continue;

        const valuePath = (propPath as NodePath<t.ObjectProperty>).get('value');

        if (key === 'className' || key === 'style' || key === VARS_KEY) {
            if (currQuasi) {
                quasis.push(t.templateElement({raw: currQuasi}));

                props.push(
                    t.objectProperty(
                        t.templateLiteral(quasis, expressions),
                        t.booleanLiteral(true),
                    ),
                );
            }

            props.push(propPath.node);

            quasis = [];
            expressions = [];
            currQuasi = '';

            continue;
        }

        // append " " delimiter for the continuous value or if that's not the first quasi
        if (currQuasi || quasis.length !== 0) {
            currQuasi += ' ';
        }

        if (valuePath.isStringLiteral()) {
            currQuasi += key + valuePath.node.value;
        } else if (valuePath.isBooleanLiteral()) {
            currQuasi += key;
        } else {
            currQuasi += key;

            quasis.push(t.templateElement({raw: currQuasi}));
            expressions.push(valuePath.node as t.Expression);

            currQuasi = '';
        }
    }

    if (currQuasi) {
        quasis.push(t.templateElement({raw: currQuasi}));
    }

    if (expressions.length === quasis.length) {
        quasis.push(t.templateElement({raw: ''}));
    }

    if (quasis.length) {
        if (props.length === 0) {
            path.replaceWith(t.templateLiteral(quasis, expressions));

            return;
        }

        props.push(
            t.objectProperty(
                t.templateLiteral(quasis, expressions),
                t.booleanLiteral(true),
            ),
        );
    }

    path.node.properties = props;
}
