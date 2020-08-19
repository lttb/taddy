const path = require('path');

module.exports = {
    presets: ['next/babel'],

    env: {
        production: {
            plugins: [
                [
                    '@taddy',
                    {
                        compileOptions: {
                            typescript: true,
                            evaluate: true,
                        },
                        outputOptions: {
                            extractCSS: true,
                            getCSSFilepath: () => {
                                return path.join(
                                    __dirname,
                                    'styles',
                                    'taddy.css',
                                );
                            },
                        },
                    },
                ],
            ],
        },
    },
};
