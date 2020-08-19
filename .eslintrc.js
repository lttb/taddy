module.exports = {
    extends: [
        'react-app',
        'prettier/@typescript-eslint',
        'plugin:prettier/recommended',
    ],
    settings: {
        react: {
            version: '999.999.999',
        },
    },
    overrides: [
        {
            files: ['./website/**/*.tsx'],
            rules: {
                'react/react-in-jsx-scope': 'off',
            },
        },
    ],
};
