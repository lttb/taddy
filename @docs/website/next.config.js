const webpack = require('webpack');
const withMDX = require('@next/mdx');

/** @type {import('next').NextConfig} */
const config = {
    transpilePackages: ['@taddy/babel-plugin', '@taddy/core', 'taddy'],

    pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],

    webpack(config, {dev}) {
        // TODO: create @taddy/next-plugin
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

        Object.assign(config.resolve.alias, {
            fs: require.resolve('./compiler/stubs/fs'),
            path: require.resolve('./compiler/stubs/path'),
            module: require.resolve('./compiler/stubs/module'),
            'sync-rpc': require.resolve('./compiler/stubs/sync-rpc'),
            // '@babel/core': require.resolve('./compiler/stubs/babel-core'),
        });

        // config.plugins.push(
        //     new webpack.ContextReplacementPlugin(
        //         /\/filer\/|\/ts-morph\/|babel\/standalone/,
        //         (data) => {
        //             delete data.dependencies[0].critical;
        //             return data;
        //         },
        //     ),
        // );

        // handle "node:assert" etc.
        config.plugins.push(
            new webpack.NormalModuleReplacementPlugin(/^node:/, (resource) => {
                resource.request = resource.request.replace(/^node:/, '');
            }),
        );

        config.externals.push({
            typescript: 'window.ts',
        });

        config.module = {
            ...config.module,
            // there are some packages like "@babel/standalone", "ts-morph" and "filer" that use require
            // @see https://github.com/babel/babel/issues/14301
            exprContextCritical: false,
        };

        return config;
    },

    typescript: {
        ignoreBuildErrors: true,
    },

    eslint: {
        ignoreDuringBuilds: true,
    },
};

module.exports = withMDX({
    extension: /\.mdx?$/,
})(config);
