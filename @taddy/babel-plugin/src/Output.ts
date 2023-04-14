import type {PluginPass} from '@babel/core';

import * as fs from 'fs';
import * as path from 'path';
import resolve from 'resolve';
import stringHash from 'string-hash';
import findCacheDirectory from 'find-cache-dir';

import {$css, config} from 'taddy';

import type {Env, Target} from './types';

const DEFAULT_CACHE_DIR = path.join(__dirname, '../cache');

function getCacheDir() {
    return (
        findCacheDirectory({name: 'taddy', create: true}) || DEFAULT_CACHE_DIR
    );
}

const LAST_INDEX = 0;
const STYLES: string[] = [];

function getStylesState() {
    const {rules} = $css.ruleInjector.styleSheet;
    const newRules = rules.slice(LAST_INDEX);

    // there is also "appending" rules, that don't change the index, but change the rule
    // TODO: think how to handle that
    // LAST_INDEX = rules.length;

    const added = [...newRules].map((rule) => rule.cssText || '');

    STYLES.push(...added);

    return {
        added,
    };
}

type FilenameGetter = string | ((code?: string) => string);
type FilepathGetter = string | ((filename: string) => string);

export type OutputOptions = {
    cacheDir: string;
};

function getMtime(filepath: string): number {
    return Number(fs.statSync?.(filepath).mtime);
}

const filesMap = new Map();
const contentMap = new Map();

function readFileSync(filepath: string): string {
    if (!fs.existsSync(filepath)) return '';

    let data = '';

    try {
        const mtime = getMtime(filepath);
        if (filesMap.has(mtime)) {
            return filesMap.get(mtime);
        }

        data = fs.readFileSync(filepath).toString();

        if (!data) return '';

        filesMap.set(mtime, data);
        contentMap.set(data, mtime);
    } catch (e) {
        console.error('error', e);
    }

    return data;
}

function mkdir(filepath) {
    fs.mkdirSync(path.dirname(filepath), {recursive: true});
}

function appendFile(filepath: string, append: string) {
    // const code = content + append;
    // if (contentMap.has(code)) {
    //     return;
    // }

    // fs.appendFile(filepath, append, () => {});

    mkdir(filepath);

    fs.appendFileSync(filepath, append);
}

function writeFile(filepath: string, code: string) {
    // const code = content + append;
    // if (contentMap.has(code)) {
    //     return;
    // }

    // fs.appendFile(filepath, append, () => {});

    mkdir(filepath);

    fs.writeFileSync(filepath, code);
}

function cleanFileCache(filepath: string) {
    fs.rmdirSync(filepath, {recursive: true});
}

/** don't merge declarations in plugin, currently considering only dev mode */
$css.ruleInjector.styleSheet.options.mergeDeclarations = false;

export class Output {
    env: Env;
    config: OutputOptions;
    filepath: string;

    defaultCacheDir = getCacheDir();

    constructor({env, config}: {env: Env; config?: Partial<OutputOptions>}) {
        this.env = env;

        this.config = Object.assign(
            {
                // getCSSFilename = (content) => `atoms-${stringHash(content)}.css`,
                cacheDir: this.defaultCacheDir,
            },
            config,
        );

        // const filename = this.resolveFilepath(this.config.cssFilename);
        // this.filepath = this.resolveFilepath(this.config.cssFilepath, filename);

        this.filepath = path.join(this.config.cacheDir, 'taddy.css');

        mkdir(this.filepath);

        // console.log('filepath', this.filepath);

        /* clean cache */
        // fs.writeFileSync(this.filepath, '');
    }

    private resolveFilepath<T extends FilenameGetter | FilepathGetter>(
        getter: T,
        ...params: T extends (...args: any) => any ? Parameters<T> : []
    ): string {
        if (typeof getter !== 'string') {
            // @ts-expect-error TODO: fix getter params
            return getter(...params);
        }

        return getter;
    }

    save({
        sourceMap,
        filenameRelative,
        target,
    }: {
        sourceMap: string;
        filenameRelative: string;
        target: Target;
    }) {
        const stylesData = readFileSync(this.filepath);
        const {added} = getStylesState();

        // console.log({added});

        // TODO: improve filter performance
        const diffStyles = added
            .filter((x) => !stylesData.includes(x))
            .join('');

        appendFile(this.filepath, diffStyles);
        // appendFile(this.filepath, sourceMap);

        const filenameHash = stringHash(`${filenameRelative}`).toString(36);

        const localFileCachePath = path.join(
            this.config.cacheDir,
            filenameHash + '.taddy.css',
        );
        const localFileCacheData = readFileSync(localFileCachePath);
        const localFileCacheDiff = added
            .filter((x) => !localFileCacheData.includes(x))
            .join('');

        appendFile(localFileCachePath, localFileCacheDiff);

        const localFileContent = localFileCacheData + localFileCacheDiff;
        const localFileContentHash = stringHash(localFileContent).toString(36);
        const localFilename = path.join(
            filenameHash,
            localFileContentHash + '.taddy',
        );
        const localFilepath = path.join(
            this.config.cacheDir,
            // stringHash(`${filename}:${added}`) + '.taddy.css',
            localFilename,
        );

        writeFile(
            localFilepath + '.css',
            localFileContent.replace(/}$/, sourceMap + '}'),
        );

        const importBase =
            this.config.cacheDir === this.defaultCacheDir
                ? '.cache/taddy'
                : path.relative(
                      path.dirname(filenameRelative),
                      this.config.cacheDir,
                  );

        if (target === 'remix') {
            writeFile(
                localFilepath + '.cjs',
                `require('./${localFilename}.css');`,
            );
            writeFile(localFilepath + '.js', `import './${localFilename}.css'`);

            return {importName: path.join(importBase, localFilename)};
        }

        return {importName: path.join(importBase, `${localFilename}.css`)};
    }
}
