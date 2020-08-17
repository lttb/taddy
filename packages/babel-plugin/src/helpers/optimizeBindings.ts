import type {NodePath, Binding} from '@babel/traverse';

import {findBindings} from './findBindings';

function isTaddy(binding: Binding) {
    const {path} = binding;
    const {parentPath} = path;

    return (
        parentPath.isImportDeclaration() &&
        parentPath.node.source.value === 'taddy'
    );
}

export function optimizeBindings(referentPath: NodePath) {
    let bindings: ReturnType<typeof findBindings>;

    try {
        bindings = findBindings(referentPath);
    } catch (error) {
        console.log('ERROR', {error});

        return;
    }

    for (let binding of bindings) {
        if (isTaddy(binding)) continue;

        binding.references--;

        optimizeBindings(binding.path);

        if (binding.references === 0) {
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
}
