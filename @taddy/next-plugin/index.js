const path = require('path');

/** @param {{}} [pluginOptions] */
module.exports = function (pluginOptions = {}) {
    /** @param {import('next').NextConfig} nextConfig */
    return (nextConfig) => {
        /** @type {import('next').NextConfig} */
        const config = {
            webpack(config, options) {
                const {dev, dir} = options;

                const taddyOptions = {
                    ...pluginOptions,
                    outputOptions: {
                        cacheDir: path.join(dir, '.next/cache/taddy'),

                        ...pluginOptions.outputOptions,
                    },
                };

                if (!dev) {
                    // @see https://github.com/webpack-contrib/mini-css-extract-plugin#extracting-all-css-in-a-single-file
                    config.optimization.splitChunks.cacheGroups = {
                        ...config.optimization.splitChunks.cacheGroups,
                        styles: {
                            name: 'styles',
                            type: 'css/mini-extract',
                            test: /\.taddy\.css$/,
                            chunks: 'all',
                            enforce: true,
                        },
                    };
                }

                config.module.rules.push({
                    test: /\.(tsx|ts|js|mjs|jsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: require.resolve('./loader.cjs'),
                        options: taddyOptions,
                    },
                });

                const cssRules = config.module.rules.find(
                    (rule) =>
                        Array.isArray(rule.oneOf) &&
                        rule.oneOf.some(({test}) => test.test?.('global.css')),
                ).oneOf;

                let globalCSSLoader;
                for (const rule of cssRules) {
                    if (rule.test.test?.('global.css') && rule.sideEffects) {
                        globalCSSLoader = rule;

                        break;
                    }
                }

                if (globalCSSLoader) {
                    cssRules.unshift({
                        test: /\.taddy\.css$/i,
                        sideEffects: true,
                        use: globalCSSLoader.use,
                    });
                }

                if (typeof nextConfig.webpack === 'function') {
                    return nextConfig.webpack(config, options);
                }

                return config;
            },
        };

        return Object.assign({}, nextConfig, config);
    };
};
