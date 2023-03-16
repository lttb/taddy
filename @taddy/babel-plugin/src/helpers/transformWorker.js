const {transformAsync} = require('@babel/core');
const tsPreset = require('@babel/preset-typescript');
const envPreset = require('@babel/preset-env');

const workerpool = require('workerpool');

const DEFAULT_PRESETS = [
    [tsPreset, {allExtensions: true, isTSX: true}],
    // '@babel/preset-react',
    [
        envPreset,
        {
            targets: {node: '12'},
            useBuiltIns: false,
            ignoreBrowserslistConfig: true,
        },
    ],
];

function transform({content, filename}) {
    return transformAsync(content, {
        babelrc: false,
        configFile: false,
        filename,
        plugins: [
            /*...opts.plugins*/
        ],
        presets: [/*...opts.presets*/ ...DEFAULT_PRESETS],
    });
}

function init(connection) {
    // you can setup any connections you need here
    return function ({content, filename}) {
        // Note how even though we return a promise, the resulting rpc client will be synchronous
        return transform({content, filename});
    };
}
module.exports = init;
