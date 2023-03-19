/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        appDir: true,
    },

    typescript: {
        ignoreBuildErrors: true,
    },

    webpack(config, {dev}) {
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

        return config;
    },
};

module.exports = nextConfig;
