const path = require('path');

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
