import type {NodePath, Binding} from '@babel/traverse';
import * as t from '@babel/types';

import {findBindings, addBinding} from './findBindings';
import type {BindingMap} from './findBindings';

function isTaddy(binding: Binding) {
    const {path} = binding;

    if (!path.isImportSpecifier()) return false;

    const {imported} = path.node;

    return (
        t.isIdentifier(imported) &&
        (((path.parentPath as NodePath<t.ImportDeclaration>).node.source
            .value === 'taddy' &&
            imported.name === 'css') ||
            imported.name === 'mixin')
    );
}

export class BindingOptimizer {
    cache: BindingMap = new Map();

    process(referentPath: NodePath) {
        let bindings: ReturnType<typeof findBindings>;

        try {
            bindings = findBindings(referentPath);
        } catch (error) {
            return;
        }

        for (const [binding, paths] of bindings) {
            if (isTaddy(binding)) continue;

            if (binding.path.removed) continue;

            this.process(binding.path);

            addBinding(this.cache, binding, paths);

            if (this.cache.get(binding)!.size < binding.references) {
                continue;
            }

            binding.path.remove();

            const {parentPath} = binding.path;

            const isImportToRemove =
                parentPath?.isImportDeclaration() &&
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
}
