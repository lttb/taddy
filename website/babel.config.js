module.exports = {
    presets: ['next/babel'],

    plugins: [
        [
            '@taddy',
            {
                compileOptions: {
                    typescript: false,
                    evaluate: true,
                },
                outputOptions: {
                    cssFilepath: 'styles/taddy.css',
                },
            },
        ],
    ],
};
