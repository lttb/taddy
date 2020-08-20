const path = require('path');
const webpack = require('webpack');

module.exports = {
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
};
