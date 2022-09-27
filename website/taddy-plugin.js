module.exports = (pluginOptions = {}) => (nextConfig = {}) => {
    const extension = pluginOptions.extension || /\.mdx$/;

    return Object.assign({}, nextConfig, {
        webpack(config, options) {
            config.module.rules.push({
                test: /@taddy\/babel-plugin.*\.css/,
                use: [],
            });

            if (typeof nextConfig.webpack === 'function') {
                return nextConfig.webpack(config, options);
            }

            return config;
        },
    });
};
