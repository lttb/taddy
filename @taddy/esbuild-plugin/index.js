const babel = require('@babel/core');
const taddyBabelPlugin = require('@taddy/babel-plugin');
const fs = require('node:fs');
const path = require('path');

function taddyPlugin() {
    return {
        name: '@taddy/esbuild-plugin',
        setup({onLoad}) {
            const root = process.cwd();
            onLoad({filter: /\.[tj]sx$/}, async (args) => {
                if (args.path.endsWith('.taddy.js')) return;

                let code = await fs.promises.readFile(args.path, 'utf8');
                let plugins = [
                    'importMeta',
                    'topLevelAwait',
                    'classProperties',
                    'classPrivateProperties',
                    'classPrivateMethods',
                    'jsx',
                ];
                let loader = 'jsx';
                if (args.path.endsWith('.tsx')) {
                    plugins.push('typescript');
                    loader = 'tsx';
                }
                const result = await babel.transformAsync(code, {
                    babelrc: false,
                    configFile: false,
                    ast: false,
                    root,
                    filename: args.path,
                    parserOpts: {
                        sourceType: 'module',
                        allowAwaitOutsideFunction: true,
                        plugins,
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
                    loader,
                    resolveDir: path.dirname(args.path),
                };
            });
        },
    };
}

module.exports = taddyPlugin;
