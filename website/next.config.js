const path = require('path');
const webpack = require('webpack');

const withPlugins = require('next-compose-plugins');
const withMDX = require('@next/mdx')();
const optimizedImages = require('next-optimized-images');

module.exports = withPlugins(
    [
        [
            withMDX,
            {
                extension: /\.mdx?$/,
            },
        ],
        [
            optimizedImages,
            {
                inlineImageLimit: 1000,
                handleImages: ['jpeg', 'png', 'svg', 'webp', 'gif', 'ico'],
            },
        ],
    ],
    {
        pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],

        target: 'serverless',

        webpack(config) {
            Object.assign(config.resolve.alias, {
                fs: require.resolve('./compiler/stubs/fs'),
                path: require.resolve('./compiler/stubs/path'),
            });

            config.module.rules.forEach((rule) => {
                if (!rule.include) return;
                rule.include.push(path.join(__dirname, '../packages'));
            });

            config.plugins.push(
                new webpack.ContextReplacementPlugin(/\/filer\//, (data) => {
                    delete data.dependencies[0].critical;
                    return data;
                }),
            );

            config.externals.push({
                typescript: 'window.ts',
            });

            return config;
        },

        typescript: {
            ignoreBuildErrors: true,
        },
    },
);
