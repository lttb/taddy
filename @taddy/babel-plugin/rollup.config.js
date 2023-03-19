import commonConfig from '../../rollup.config.common';

const config = {
    ...commonConfig,

    input: ['index.ts', 'macro.ts', './src/helpers/transformWorker.js'],
};

export default config;
