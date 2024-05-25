import commonConfig from '../../rollup.config.common';

const config = {
    ...commonConfig,

    input: ['index.js', 'loader.cjs'],
};

export default config;
