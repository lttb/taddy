import commonConfig from '../rollup.config.common';

const config = {
    ...commonConfig,

    input: ['index.ts', 'index.native.ts', 'vue/index.ts'],
};

export default config;
