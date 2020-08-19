const path = require('path');

module.exports = {
    presets: ['next/babel'],
    plugins: [
        [
            '@taddy',
            {
                compileOptions: {
                    typescript: false,
                    evaluate: false,
                },
                outputOptions: {
                    extractCSS: true,
                    getCSSFilepath: () => {
                        return path.join(__dirname, 'styles', 'taddy.css');
                    },
                },
            },
        ],
    ],
};
