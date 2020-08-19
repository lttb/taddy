import * as t from '@babel/types';
import type {NodePath} from '@babel/traverse';

export function getObjectPropertyKey(path: NodePath<t.ObjectProperty['key']>) {
    if (path.isIdentifier()) {
        return path.node.name;
    }

    if (path.isLiteral() && 'value' in path.node) {
        return String(path.node.value);
    }

    return null;
}
