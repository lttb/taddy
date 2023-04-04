const babel = require('@babel/core');
const taddyBabelPlugin = require('@taddy/babel-plugin');
const fs = require('fs');
const path = require('path');

function taddyPlugin() {
    /** @type {import('esbuild').Plugin} */
    const plugin = {
        name: '@taddy/esbuild-plugin',
        setup({onLoad}) {
            const root = process.cwd();

            onLoad({filter: /\.[tj]sx$/}, async (args) => {
                const id = args.path;

                if (id.includes('.taddy.js')) return;

                const code = await fs.promises.readFile(id, 'utf8');

                const extname = path.extname(id);

                const isTypescript = extname === '.tsx' || extname === '.ts';

                const result = await babel.transformAsync(code, {
                    babelrc: false,
                    configFile: false,
                    ast: false,
                    root,
                    filename: id,
                    parserOpts: {
                        allowAwaitOutsideFunction: true,
                        plugins: [
                            'importMeta',
                            'topLevelAwait',
                            'classProperties',
                            'classPrivateProperties',
                            'classPrivateMethods',
                            'jsx',
                        ].concat(isTypescript ? ['typescript'] : []),
                    },
                    generatorOpts: {
                        decoratorsBeforeExport: true,
                    },
                    plugins: [taddyBabelPlugin],
                    sourceMaps: true,
                    inputSourceMap: false,
                });

                return {
                    contents:
                        result.code +
                        `//# sourceMappingURL=data:application/json;base64,` +
                        Buffer.from(JSON.stringify(result.map)).toString(
                            'base64',
                        ),
                    loader: isTypescript ? 'tsx' : 'jsx',
                    resolveDir: path.dirname(id),
                };
            });
        },
    };

    return plugin;
}

module.exports = taddyPlugin;
