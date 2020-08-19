import * as t from '@babel/types';

type Properties = t.ObjectExpression['properties'];

export function mergeObjectProperties(properties: Properties) {
    const map = new Map();

    function move(key, value) {
        map.delete(key);
        map.set(key, value);
    }

    for (const x of properties) {
        if (!t.isObjectProperty(x)) {
            move(x, x);
            continue;
        }

        const {key} = x;

        if (t.isIdentifier(key)) {
            move(key.name, x);
            continue;
        }

        if (t.isStringLiteral(key)) {
            move(key.value, x);
            continue;
        }

        move(x, x);
    }

    // TODO: there was a problem with typescript compiler with the variant [...map.values()]

    return Array.from(map.values());
}

export function mergeObjects(objects: t.ObjectExpression[]) {
    const properties: Properties = [];
    objects.forEach((obj) => {
        properties.push(...obj.properties);
    });
    return mergeObjectProperties(properties);
}
