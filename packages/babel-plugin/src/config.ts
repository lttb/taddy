/* eslint-disable */

import findCacheDir from 'find-cache-dir';
import path from 'path';
import mkdirp from 'mkdirp';

import type {Project as TSProject} from 'ts-morph';
import {lilconfigSync} from 'lilconfig';

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
export const cacheDir = findCacheDir({name: PACKAGE_NAME}) || DEFAULT_CACHE_DIR;

export const getCachedModuleFilepath = (filepath: string) => {
    if (cacheDir === DEFAULT_CACHE_DIR) {
        return filepath;
    }

    const filename = path.basename(filepath);

    return `.cache/${PACKAGE_NAME}/${filename}`;
};

try {
    mkdirp.sync(cacheDir);
} catch (error) {
    // TODO: handle this error

    console.error('TADDY', 'can not create cache dir', error);
}
