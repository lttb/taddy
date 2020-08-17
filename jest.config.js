const {pathsToModuleNameMapper} = require('ts-jest/utils');
const {compilerOptions} = require('./tsconfig');

module.exports = {
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
        prefix: '<rootDir>/',
    }),

    testPathIgnorePatterns: ['dist', 'node_modules'],

    roots: ['<rootDir>/packages/'],

    globals: {
        'ts-jest': {
            diagnostics: false,
        },
    },
};
