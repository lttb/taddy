module.exports = {
    presets: ['next/babel'],

    plugins: [
        [
            '@taddy',
            {
                compileOptions: {
                    evaluate: true,
                },
            },
        ],
    ],
};
