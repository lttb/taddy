const babel = require('@babel/core');
const taddyBabelPlugin = require('@taddy/babel-plugin');
const path = require('path');

const SUPPORTED_EXTENSIONS = new Set(['.tsx', '.ts', '.jsx', '.js', '.astro']);

/**
 * @param {object} options
 * @param {string} [options.unstable_target]
 **/
function taddyPlugin({unstable_target} = {}) {
    /** @type {import('vite').Plugin} */
    const plugin = {
        name: '@taddy/vite-plugin',

        async transform(code, id) {
            if (id.includes('.taddy.js')) return;

            const extname = path.extname(id);

            if (!SUPPORTED_EXTENSIONS.has(extname)) {
                return;
            }

            const root = process.cwd();

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

    return plugin;
}

module.exports = taddyPlugin;
