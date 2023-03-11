import type {NodePath} from '@babel/traverse';

import {findBindings} from './findBindings';

function getPathsByBindings(
    bindings: ReturnType<typeof findBindings>,
): Set<NodePath<any>> {
    const paths = new Set<NodePath<any>>();

    for (let x of bindings.keys()) {
        if (x.path.isImportSpecifier() || x.path.isVariableDeclarator()) {
            paths.add(x.path.parentPath);
            continue;
        }

        paths.add(x.path);
    }

    return paths;
}

export function buildCodeByPath(path: NodePath): string {
    return Array.from(
        getPathsByBindings(findBindings(path, {throwError: true})),
    )
        .sort((a, b) => a.node.start - b.node.start)
        .map((x) => x.toString())
        .join('\n');
}
