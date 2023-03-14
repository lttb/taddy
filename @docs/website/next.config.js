const withPlugins = require('next-compose-plugins');
const withMDX = require('@next/mdx');

/** @type {import('next').NextConfig} */
module.exports = withPlugins(
    [
        withMDX({
            extension: /\.mdx?$/,
        }),
        // [
        //     optimizedImages,
        //     {
        //         inlineImageLimit: 1000,
        //         handleImages: ['jpeg', 'png', 'svg', 'webp', 'gif', 'ico'],
        //     },
        // ],
    ],
    {
        transpilePackages: ['@taddy/babel-plugin', '@taddy/core', 'taddy'],

        pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],

        webpack(config) {
            Object.assign(config.resolve.alias, {
                fs: require.resolve('./compiler/stubs/fs'),
                path: require.resolve('./compiler/stubs/path'),
                module: require.resolve('./compiler/stubs/fs'),
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
    },
);
