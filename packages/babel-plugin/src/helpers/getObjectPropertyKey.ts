import * as t from '@babel/types';
import type {NodePath} from '@babel/traverse';

export function getObjectPropertyKey(path: NodePath<t.ObjectProperty>) {
    if (t.isIdentifier(path.node.key)) {
        return path.node.key.name;
    }

    if (t.isLiteral(path.node.key) && 'value' in path.node.key) {
        return path.node.key.value;
    }

    return null;
}
