/** @type {import('eslint').Linter.Config} */
module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
    },
    extends: [
        'eslint:recommended',
        'plugin:import/recommended',
        'plugin:import/typescript',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
        'plugin:react-hooks/recommended',
        'prettier',
    ],
    settings: {
        'import/ignore': ['react-native'],

        react: {
            version: '18',
        },
    },
    rules: {
        'react/react-in-jsx-scope': 'off',
    },
    overrides: [
        {
            files: ['**/*.{js,cjs}', '@taddy/babel-plugin/**'],
            rules: {
                '@typescript-eslint/no-var-requires': 'off',
            },
        },
    ],
    env: {
        browser: true,
        es2022: true,
        node: true,
    },
};
