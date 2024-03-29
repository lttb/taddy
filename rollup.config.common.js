import typescript from '@rollup/plugin-typescript';
import externals from 'rollup-plugin-node-externals';
import copy from 'rollup-plugin-copy';

/** @type {import('rollup').RollupOptions} */
const config =
    // ES module build (replaces broken basic TypeScript compilation)
    // * ref: <https://github.com/microsoft/TypeScript/issues/18442> , <https://github.com/alshdavid/rxjs/blob/main/rollup.config.js#L10>
    // * ref: <https://github.com/microsoft/TypeScript/pull/35148>
    // * ref: <https://github.com/microsoft/TypeScript/issues/37582>
    {
        output: [
            {
                dir: 'lib',
                format: 'esm',
                entryFileNames: '[name].js',
                sourcemap: true,
                preserveModules: true, // or `false` to bundle as a single file
            },
            {
                dir: 'lib',
                format: 'cjs',
                entryFileNames: '[name].cjs',
                sourcemap: true,
                preserveModules: true, // or `false` to bundle as a single file
            },
        ],
        plugins: [
            externals(),

            typescript({
                exclude: ['**/tests/**', '**/*.test.*'],
                compilerOptions: {
                    incremental: false,
                },
            }),

            copy({
                targets: [
                    {src: 'README.md', dest: 'lib'},
                    {src: 'CHANGELOG.md', dest: 'lib'},
                    {
                        src: 'package.json',
                        dest: 'lib',
                        transform: (contents) => {
                            const packageJson = JSON.parse(contents.toString());

                            return JSON.stringify({
                                ...packageJson,

                                main: 'index.cjs',
                                module: 'index.js',
                                exports: {
                                    ...packageJson.exports,

                                    ...(packageJson.name ===
                                        '@taddy/babel-plugin' && {
                                        './lib/': './',
                                        './cache/': './cache/',
                                        './macro': {
                                            import: './macro.js',
                                            require: './macro.cjs',
                                        },
                                    }),

                                    ...(packageJson.name === 'taddy' && {
                                        './vue': {
                                            import: './vue/index.js',
                                            require: './vue/index.cjs',
                                        },
                                    }),

                                    '.': {
                                        import: './index.js',
                                        require: './index.cjs',
                                    },
                                    './package.json': './package.json',
                                },
                            });
                        },
                    },
                ],
            }),
        ],
    };

export default config;
