const babel = require('@babel/core');
const taddyBabelPlugin = process.version.bun
    ? // import typescript module for bun
      require('@taddy/babel-plugin/index')
    : require('@taddy/babel-plugin');
const path = require('path');

/** @type {import('webpack').LoaderDefinition} */
const loader = function (code) {
    const callback = this.async();
    const id = this.resourcePath;
    const options = this.getOptions();

    if (id.includes('.taddy.js')) {
        callback(null, code);

        return;
    }

    const root = process.cwd();

    const extname = path.extname(id);

    const isTypescript = extname === '.tsx' || extname === '.ts';

    babel
        .transformAsync(code, {
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
            plugins: [[taddyBabelPlugin, options]],
            sourceMaps: true,
            inputSourceMap: false,
        })
        .then((result) => {
            callback(null, result.code, result.map);
        })
        .catch((err) => {
            callback(err);
        });
};

module.exports = loader;
