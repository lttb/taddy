import type {
    types as t,
    PluginPass,
    NodePath,
    ConfigAPI,
    PluginObj,
} from '@babel/core';
import type {NodePaths} from '@babel/traverse';

import {PACKAGE_NAME} from './config';
import {macro} from './macro-plugin';
import type {MacroConfig} from './macro-plugin';
import {isTaddyEvaluation} from './helpers';

type ImportSpecifiers = NodePaths<t.ImportDeclaration['specifiers']>;

function getImportNames(
    path: ImportSpecifiers[number],
): {localName: string; importedName: string} {
    const localName = path.node.local.name;

    if (path.isImportSpecifier()) {
        return {
            localName,
            importedName: path.node.imported.name,
        };
    }

    if (path.isImportDefaultSpecifier()) {
        return {localName, importedName: 'default'};
    }

    return {localName, importedName: 'namespace'};
}

function findReferences(paths: ImportSpecifiers) {
    const references = {};
    for (let path of paths) {
        const {localName, importedName} = getImportNames(path);
        const binding = path.scope.getBinding(localName);
        if (binding?.referencePaths) {
            references[importedName] = binding.referencePaths;
        }
    }
    return references;
}

interface TaddyPluginPass extends PluginPass {
    references: Record<string, NodePath[]>;
}

export {MacroConfig};

export default function plugin(
    babel: ConfigAPI,
    options: MacroConfig,
): PluginObj<TaddyPluginPass> {
    return {
        name: 'taddy',

        pre() {
            this.references = {};
        },

        visitor: {
            // TODO: support require expression

            ImportDeclaration(path, state) {
                if (isTaddyEvaluation(state)) {
                    return;
                }

                if (path.node.source.value !== PACKAGE_NAME) {
                    return;
                }

                Object.assign(
                    this.references,
                    findReferences(path.get('specifiers')),
                );

                if (Object.keys(this.references as object).length === 0) {
                    return;
                }

                macro({
                    references: this.references,
                    babel,
                    state,
                    config: options,
                });
            },
        },
    };
}
