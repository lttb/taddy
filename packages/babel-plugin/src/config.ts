/* eslint-disable */

import path from 'path';

export const MACRO_NAME = 'taddy.macro';
export const PACKAGE_NAME = 'taddy';

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

export function getRootDir() {
    return process.cwd();
}

export function getCacheDir() {
    return path.join(__dirname, '..');
}
