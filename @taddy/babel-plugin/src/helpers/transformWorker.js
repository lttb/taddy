/* a worker used by "sync-rpc" */

const {transformAsync} = require('@babel/core');
const tsPreset = require('@babel/preset-typescript');
const envPreset = require('@babel/preset-env');

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

const init =
    () =>
    ({content, filename}) => {
        const transformOptions = {
            babelrc: false,
            configFile: false,
            filename,
            plugins: [
                /*...opts.plugins*/
            ],
            presets: [/*...opts.presets*/ ...DEFAULT_PRESETS],
        };

        return transformAsync(content, transformOptions);
    };

module.exports = init;
