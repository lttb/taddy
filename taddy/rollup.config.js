import commonConfig from '../rollup.config.common';

const config = {
    ...commonConfig,

    input: ['index.ts', 'vue/index.ts'],
};

export default config;
