import commonConfig from '../../rollup.config.common';

const config = {
    ...commonConfig,

    input: ['index.ts', 'macro.ts', './src/helpers/evaluate.worker.js'],
};

export default config;
