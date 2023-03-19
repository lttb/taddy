const babel = require('@babel/core');
const taddyBabelPlugin = require('@taddy/babel-plugin');
const path = require('path');

const SUPPORTED_EXTENSIONS = new Set(['.tsx', '.ts', '.jsx', '.js', '.astro']);

function taddyPlugin({unstable_target = 'vue'} = {}) {
    return {
        name: '@taddy/vite-plugin',

        async transform(src, id) {
            const extname = path.extname(id);

            if (!SUPPORTED_EXTENSIONS.has(extname)) {
                return;
            }

            const root = process.cwd();

            if (id.includes('.taddy.js')) return;

            let plugins = [
                'importMeta',
                'topLevelAwait',
                'classProperties',
                'classPrivateProperties',
                'classPrivateMethods',
                'jsx',
            ];
            if (extname === '.tsx' || extname === '.ts') {
                plugins.push('typescript');
            }

            const result = await babel.transformAsync(src, {
                babelrc: false,
                configFile: false,
                ast: false,
                root,
                filename: id,
                parserOpts: {
                    sourceType: 'module',
                    allowAwaitOutsideFunction: true,
                    plugins,
                },
                generatorOpts: {
                    decoratorsBeforeExport: true,
                },
                plugins: [[taddyBabelPlugin, {unstable_target}]],
                sourceMaps: true,
                inputSourceMap: false,
            });

            return {
                code: result.code,
                map: result.map,
            };
        },
    };
}

module.exports = taddyPlugin;
