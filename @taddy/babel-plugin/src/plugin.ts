import type {
    types as t,
    PluginPass,
    NodePath,
    ConfigAPI,
    PluginObj,
} from '@babel/core';
import type {NodePaths} from '@babel/traverse';

import {PACKAGE_NAME, getEnv} from './config';
import {isTaddyEvaluation} from './helpers/utils';
import {macro, type MacroConfig} from './macro-plugin';

type ImportSpecifiers = NodePaths<t.ImportDeclaration['specifiers']>;

function getImportNames(path: ImportSpecifiers[number]): {
    localName: string;
    importedName: string;
} {
    const localName = path.node.local.name;

    if (path.isImportSpecifier()) {
        const imported = path.node.imported as t.Identifier;

        return {
            localName,
            importedName: imported.name,
        };
    }

    if (path.isImportDefaultSpecifier()) {
        return {localName, importedName: 'default'};
    }

    return {localName, importedName: 'namespace'};
}

function findReferences(paths: ImportSpecifiers) {
    const references = {};
    for (const path of paths) {
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

export default function plugin(
    babel: ConfigAPI,
    options: MacroConfig,
): PluginObj<TaddyPluginPass> {
    const env = getEnv(babel);

    return {
        name: '@taddy/babel-plugin',

        pre() {
            this.references = {};
        },

        visitor: {
            // TODO: support require expression

            ImportDeclaration(path, state) {
                // console.log('run', state.file.code, state.filename);

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

                if (!(this.references.css || this.references.mixin)) {
                    return;
                }

                macro({
                    references: this.references,
                    babel,
                    state,
                    config: {
                        env,
                        ...options,
                    },
                });
            },
        },
    };
}
