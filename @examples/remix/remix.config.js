const {withEsbuildOverride} = require('remix-esbuild-override');
const taddyPlugin = require('@taddy/esbuild-plugin');

withEsbuildOverride((option) => {
    option.plugins.unshift(taddyPlugin());

    return option;
});

/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
    ignoredRouteFiles: ['**/.*'],

    serverDependenciesToBundle: [/@taddy/],

    future: {
        unstable_cssSideEffectImports: true,
    },

    // appDirectory: "app",
    // assetsBuildDirectory: "public/build",
    // serverBuildPath: "build/index.js",
    // publicPath: "/build/",
};
