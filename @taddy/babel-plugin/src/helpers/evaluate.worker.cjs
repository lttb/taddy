const {transform} = require('@babel/core');
const path = require('path');
const fs = require('fs');
const resolve = require('resolve');

const EXTENSIONS = ['.es6', '.es', '.js', '.mjs', '.jsx', '.tsx', '.ts'];
const DEFAULT_PRESETS = [
    ['@babel/preset-typescript', {allExtensions: true, isTSX: true}],
    ['@babel/preset-env', {targets: {node: '12'}, modules: 'cjs'}],
];

require('@babel/register')({
    ignore: [
        (filename) => {
            // consider symlinks
            const realpath = fs.realpathSync(filename);

            if (realpath.includes('node_modules')) return true;

            return false;
        },
    ],
    presets: DEFAULT_PRESETS,
    cache: process.env.NODE_ENV !== 'test',
    extensions: EXTENSIONS,
});

const {config} = require('taddy');

const {EVAL_FILENAME_POSTFIX} = require('./utils.cjs');

// webpack "require" critical dependency issue workaround
const nodeRequire = new Function(
    'require',
    `return typeof require !== 'undefined'
        ? require
        : (typeof globalThis !== 'undefined' ? globalThis : global).require; `,
)(module.require);

const transformCode = async ({content, filename}) => {
    /** @type {import('@babel/core').TransformOptions} */
    const transformOptions = {
        filename,
        presets: DEFAULT_PRESETS,
    };

    // TODO: switch to async transform (need to support sync browser version)
    return transform(content, transformOptions);
};

const evaluate = async ({content, filename, callbackName}) => {
    const ext = path.extname(filename);
    const basename = path.basename(filename, ext);
    const dirname = path.dirname(filename);
    const evalFilename = path.join(
        dirname,
        basename + EVAL_FILENAME_POSTFIX + ext,
    );

    const {code} = await transformCode({content, filename: evalFilename});

    if (!code) return {error: new Error('TRANSPILATION_ERROR')};

    // console.log({code});

    const exec = new Function('require', callbackName, code);

    let value;
    try {
        const currentTarget = config.unstable_target;

        config({unstable_target: 'compiler'});
        exec(
            (filepath) => {
                const requirePath = resolve.sync(filepath, {
                    extensions: EXTENSIONS,
                    basedir: path.dirname(filename),
                });

                return nodeRequire(requirePath);
            },
            (result) => {
                value = result;
            },
        );
        config({unstable_target: currentTarget});

        // console.log('eval success', value);
    } catch (error) {
        // console.log('eval error', error);

        return {error};
    }

    // console.log('VALUE', {value});

    // for some reason, there is an additional ":" prefix on deserialisation/serialisation
    // for example, {':hover': {color: 'red'}} becomes {'::hover': {color: 'red'}}
    return {value: JSON.stringify(value)};
};

module.exports = () => evaluate;
