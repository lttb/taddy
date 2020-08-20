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

                            cssFilepath: path.join(
                                __dirname,
                                'styles',
                                'taddy.css',
                            ),
                        },
                    },
                ],
            ],
        },
    },
};
