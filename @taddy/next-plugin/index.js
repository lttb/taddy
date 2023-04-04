/** @param {{}} [pluginOptions] */
module.exports = function (pluginOptions = {}) {
    /** @param {import('next').NextConfig} nextConfig */
    return (nextConfig) => {
        /** @type {import('next').NextConfig} */
        const config = {
            webpack(config, options) {
                if (!options.dev) {
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
                        options: {
                            ...pluginOptions,
                        },
                    },
                });

                if (typeof nextConfig.webpack === 'function') {
                    return nextConfig.webpack(config, options);
                }

                return config;
            },
        };

        return Object.assign({}, nextConfig, config);
    };
};
