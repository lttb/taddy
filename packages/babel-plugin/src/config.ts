/* eslint-disable */

import path from 'path';

import type {Project as TSProject} from 'ts-morph';

import {getType, parseObject} from './TSProcessor';

export const MACRO_NAME = 'taddy.macro';
export const PACKAGE_NAME = 'taddy';

export function loadConfig(filepath: string): object {
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

// TODO: add config resolution

// export const config = lilconfigSync(PACKAGE_NAME, {
//     searchPlaces: [`${PACKAGE_NAME}.config.ts`],
//     loaders: {
//         '.ts': loadConfig,
//     },
// }).search()?.config;

const DEFAULT_CACHE_DIR = __dirname;

export function getCacheDir() {
    let cacheDir;

    // if (typeof window !== 'undefined') {
    //     return DEFAULT_CACHE_DIR;
    // }

    try {
        const findCacheDir = require('find-cache-dir');
        cacheDir = findCacheDir({name: PACKAGE_NAME});
    } catch (error) {}

    return cacheDir || DEFAULT_CACHE_DIR;
}

export const cacheDir = getCacheDir();

export function getRelativeFilepath(from: string, to: string): string {
    return './' + path.relative(path.dirname(from), to);
}

export const getCachedModuleFilepath = (
    filepath: string,
    jsFilepath: string,
) => {
    if (cacheDir === DEFAULT_CACHE_DIR) {
        return getRelativeFilepath(filepath, jsFilepath);
    }

    const filename = path.basename(jsFilepath);

    return `.cache/${PACKAGE_NAME}/${filename}`;
};

// if (typeof window === 'undefined') {
try {
    const mkdirp = require('mkdirp');
    mkdirp.sync(cacheDir);
} catch (error) {
    // TODO: handle this error

    console.error('TADDY', 'can not create cache dir', error);
}
// }
