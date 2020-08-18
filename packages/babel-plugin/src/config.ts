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

export const cacheDir =
    findCacheDir({name: PACKAGE_NAME}) ||
    path.join(require.resolve('taddy'), '.cache');

export const getCachedModuleFilepath = (filename: string) => {
    return `.cache/${PACKAGE_NAME}/${filename}`;
};

mkdirp.sync(cacheDir);
