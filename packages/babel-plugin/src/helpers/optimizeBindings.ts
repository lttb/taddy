import type {NodePath, Binding} from '@babel/traverse';
import {types as t} from '@babel/core';

import {findBindings} from './findBindings';

import type {Env} from '../types';

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

export function optimizeBindings(
    referentPath: NodePath,
    {env}: {env?: Env} = {},
) {
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
            continue;
        }

        if (binding.references < paths.size) {
            // that should not be possible, but if so,
            // then we can't be sure that it's correct to remove this binding
            // TODO: think if we can handle this somehow

            continue;
        }

        binding.path.remove();

        const {parentPath} = binding.path;

        const isImportToRemove =
            parentPath.isImportDeclaration() &&
            parentPath.node.specifiers.length === 0;

        // // keep imports for development build
        // if (env === 'development') {
        //     return;
        // }

        if (!isImportToRemove) {
            continue;
        }

        parentPath.remove();
    }
}
