import type {NodePath, Binding} from '@babel/traverse';
import {types as t} from '@babel/core';

import {findBindings} from './findBindings';

function isTaddy(binding: Binding) {
    const {path} = binding;

    if (!path.isImportSpecifier()) return false;

    return (
        ((path.parentPath as NodePath<t.ImportDeclaration>).node.source
            .value === 'taddy' &&
            path.node.imported.name === 'css') ||
        path.node.imported.name === 'mixin'
    );
}

export function optimizeBindings(referentPath: NodePath) {
    let bindings: ReturnType<typeof findBindings>;

    try {
        bindings = findBindings(referentPath);
    } catch (error) {
        return;
    }

    // console.log(bindings);

    for (let [binding] of bindings) {
        if (isTaddy(binding)) continue;

        optimizeBindings(binding.path);
    }
    for (let [binding, paths] of bindings) {
        if (isTaddy(binding)) continue;

        if (binding.path.removed) continue;

        if (binding.references > paths.size) {
            return;
        }

        if (binding.references < paths.size) {
            // that should not be possible, but if so,
            // then we can't be sure that it's correct to remove this binding
            // TODO: think if we can handle this somehow

            return;
        }

        binding.path.remove();

        const {parentPath} = binding.path;

        if (
            parentPath.isImportDeclaration() &&
            parentPath.node.specifiers.length === 0
        ) {
            parentPath.remove();
            continue;
        }
    }
}
