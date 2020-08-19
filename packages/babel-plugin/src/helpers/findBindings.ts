import * as t from '@babel/types';
import type {NodePath, Binding} from '@babel/traverse';

type BindingSet = Set<Binding>;

const cache = new WeakMap<NodePath, BindingSet>();

export class BindingError extends Error {}

export function findBindings(currentPath: NodePath): BindingSet {
    function visitIdentifier(
        referentPath: NodePath,
        path: NodePath<t.Identifier>,
        bindingSet: BindingSet,
    ) {
        if (path.parentPath.isMemberExpression()) {
            // @ts-ignore
            path = path.parentPath.get('object');
        }

        const {parentPath, node} = path;

        if (
            !(
                parentPath.isExpression() ||
                parentPath.isSpreadElement() ||
                (parentPath.isObjectProperty() &&
                    (parentPath.node.value === node ||
                        parentPath.node.computed))
            )
        ) {
            return;
        }

        if (!('name' in node && typeof node.name === 'string')) return;

        const {name} = node;

        const sharedBinding = currentPath.scope.getBinding(name);
        const binding = referentPath.scope.getBinding(name);
        if (!binding) return;
        if (sharedBinding !== binding) return;

        if (binding.constantViolations.length > 0) {
            throw new BindingError('CONSTANT VIOLATION');
        }

        const {path: bindingPath} = binding;

        if (bindingSet.has(binding)) {
            return;
        }

        if (
            bindingPath.parentPath.isFunctionExpression() &&
            bindingPath.listKey === 'params'
        ) {
            throw new BindingError('FUNCTION ARGUMENT');
        }

        bindingSet.add(binding);

        if (bindingPath.isImportSpecifier()) {
            return;
        }

        (traverse(bindingPath) || []).forEach((x) => bindingSet.add(x));
    }

    const visited = new Set();

    function traverse(referentPath: NodePath): BindingSet {
        if (referentPath.isObjectPattern()) {
            throw new BindingError('OBJECT PATTERN');
        }

        if (cache.has(referentPath)) {
            return cache.get(referentPath)!;
        }

        const bindingSet = new Set<Binding>();

        // we should not revisit the paths, otherwise something went wrong
        if (visited.has(referentPath)) {
            return bindingSet;
        }

        visited.add(referentPath);

        if (referentPath.isIdentifier()) {
            visitIdentifier(referentPath, referentPath, bindingSet);
        }

        referentPath.traverse({
            Identifier(path) {
                visitIdentifier(referentPath, path, bindingSet);
            },
        });

        cache.set(referentPath, bindingSet);

        return bindingSet;
    }

    return traverse(currentPath);
}
