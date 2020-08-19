const path = require('path');
const webpack = require('webpack');

const externalNodeModulesRegExp = /node_modules(?!\/@zeit(?!.*node_modules))/;

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

        // config.externals = config.externals.map((external) => {
        //     if (typeof external !== 'function') return external;

        //     return (ctx, req, cb) => {
        //         if (/^typescript$/.test(req)) {
        //             return cb(null, 'ts');
        //         }

        //         return external(ctx, req, cb);
        //     };
        // });

        config.externals.push({
            typescript: 'ts',
        });

        // console.log(config);

        return config;
    },

    typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        ignoreBuildErrors: true,
    },
};
