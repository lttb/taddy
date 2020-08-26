import * as t from '@babel/types';
import type {NodePath, Binding} from '@babel/traverse';

export type BindingMap = Map<Binding, Set<NodePath>>;

const cache = new WeakMap<NodePath, BindingMap>();

export class BindingError extends Error {}

function isIterable<T>(value: unknown): value is Iterable<T> {
    return Symbol.iterator in Object(value);
}

export function addBinding(
    bindingMap: BindingMap,
    binding: Binding,
    path: NodePath<any> | Iterable<NodePath<any>>,
) {
    if (isIterable(path)) {
        for (let x of path) {
            addBinding(bindingMap, binding, x);
        }
        return;
    }
    bindingMap.set(binding, (bindingMap.get(binding) || new Set()).add(path));
}

function isFunctionArgument(path: NodePath<any>) {
    return path.listKey === 'params' && path.parentPath.isFunction();
}

export function findBindings(
    currentPath: NodePath,
    {throwError = false}: {throwError?: boolean} = {},
): BindingMap {
    function visitIdentifier(
        referentPath: NodePath,
        path: NodePath<t.Identifier>,
        bindingMap: BindingMap,
    ) {
        if (path.parentPath.isMemberExpression()) {
            // @ts-expect-error
            path = path.parentPath.get('object');
        } else if (path.parentPath.isObjectPattern()) {
            // @ts-expect-error
            path = path.parentPath.parentPath;
        }

        const {parentPath, node} = path;

        if (
            !(
                parentPath.isExpression() ||
                parentPath.isSpreadElement() ||
                (parentPath.isVariableDeclarator() &&
                    parentPath.node.init === node) ||
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

        if (bindingMap.has(binding)) {
            addBinding(bindingMap, binding, path);
            return;
        }

        if (isFunctionArgument(bindingPath)) {
            if (throwError) {
                throw new BindingError('FUNCTION ARGUMENT');
            }

            return;
        }

        addBinding(bindingMap, binding, path);

        // if (!(bindingPath.listKey === 'params')) {
        //     addBinding(bindingMap, binding, path);
        // }

        if (bindingPath.isImportSpecifier()) {
            return;
        }

        for (let [newBinding, paths] of traverse(bindingPath)) {
            addBinding(bindingMap, newBinding, paths);
        }
    }

    const visited = new Set();

    function traverse(referentPath: NodePath): BindingMap {
        if (referentPath.isObjectPattern()) {
            // throw new BindingError('OBJECT PATTERN');
        }

        if (cache.has(referentPath)) {
            return cache.get(referentPath)!;
        }

        const bindings: BindingMap = new Map();

        // we should not revisit the paths, otherwise something went wrong
        if (visited.has(referentPath)) {
            return bindings;
        }

        visited.add(referentPath);

        if (referentPath.isIdentifier()) {
            visitIdentifier(referentPath, referentPath, bindings);
        }

        referentPath.traverse({
            Identifier(path) {
                visitIdentifier(referentPath, path, bindings);
            },
        });

        cache.set(referentPath, bindings);

        return bindings;
    }

    return traverse(currentPath);
}
