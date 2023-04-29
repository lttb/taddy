import * as path from 'path';

export const MACRO_NAME = 'taddy.macro';
export const PACKAGE_NAME = 'taddy';

/**
 * @param {import('@babel/core').ConfigAPI} babel
 * @returns {import('./types').Env}
 */
export function getEnv(babel) {
    try {
        return babel.env();
    } catch (e) {
        // console.log('error', e);
    }

    const DEFAULT_ENV = 'production';

    if (!(typeof process && process.env)) {
        return DEFAULT_ENV;
    }

    return process.env.BABEL_ENV || process.env.NODE_ENV || DEFAULT_ENV;
}

// TODO: add config resolution

/*
function loadConfig(filepath: string): object {
    const {Project} = require('ts-morph');

    // empty project to parse the config
    const project: TSProject = new Project();

    const sourceFile = project.addSourceFileAtPath(filepath);

    const decl = sourceFile.getDefaultExportSymbol();

    const properties = getType(decl)
        ?.getProperties()
        .find((x) => x.getEscapedName() === 'properties');

    const result = parseObject(getType(properties));

    const compiled = project.emitToMemory().getFiles()[0].text;

    // eslint-disable-next-line
    const emit = new Function('exports', `${compiled};return exports;`);

    return {
        ...emit({}).default,
        _properties: result,
    };
}

export const config = lilconfigSync(PACKAGE_NAME, {
    searchPlaces: [`${PACKAGE_NAME}.config.ts`],
    loaders: {
        '.ts': loadConfig,
    },
}).search()?.config;
*/
