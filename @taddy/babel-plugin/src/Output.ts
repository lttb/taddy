import type {PluginPass} from '@babel/core';

import * as fs from 'fs';
import * as path from 'path';
import resolve from 'resolve';
import stringHash from 'string-hash';

import {$css, config} from 'taddy';

import {getCacheDir, getRootDir} from './config';

import type {Env, Target} from './types';

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

function resolveFilepath<T extends FilenameGetter | FilepathGetter>(
    getter: T,
    ...params: T extends (...args: any) => any ? Parameters<T> : []
): string {
    if (typeof getter !== 'string') {
        // @ts-expect-error TODO: fix getter params
        return getter(...params);
    }

    return path.join(getRootDir(), getter);
}

export type OutputOptions = {
    cssFilename: FilenameGetter;
    cssFilepath: FilepathGetter;
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

        data = fs.readFileSync?.(filepath).toString();

        if (!data) return '';

        filesMap.set(mtime, data);
        contentMap.set(data, mtime);
    } catch (e) {
        console.error('error', e);
    }

    return data;
}

function mkdir(filepath) {
    if ('mkdirSync' in fs) {
        fs.mkdirSync(path.dirname(filepath), {recursive: true});
    } else {
        // workaround for some special FS cases like "filer"
        // @ts-expect-error doesn't exit for some reason
        fs.mkdir(path.dirname(filepath), () => void 0, {recursive: true});
    }
}

function appendFile(filepath: string, append: string) {
    // const code = content + append;
    // if (contentMap.has(code)) {
    //     return;
    // }

    // fs.appendFile(filepath, append, () => {});

    mkdir(filepath);

    // // TODO: think about asynchronous appending
    if ('appendFileSync' in fs) {
        fs.appendFileSync(filepath, append);
    } else {
        // workaround for some special FS cases like "filer"
        // @ts-expect-error doesn't exit for some reason
        fs.appendFile(filepath, append, () => void 0);
    }
}

function writeFile(filepath: string, code: string) {
    // const code = content + append;
    // if (contentMap.has(code)) {
    //     return;
    // }

    // fs.appendFile(filepath, append, () => {});

    mkdir(filepath);

    // // TODO: think about asynchronous appending
    if ('writeFileSync' in fs) {
        fs.writeFileSync(filepath, code);
    } else {
        // workaround for some special FS cases like "filer"
        // @ts-expect-error doesn't exit for some reason
        fs.writeFile(filepath, code, () => void 0);
    }
}

/** don't merge declarations in plugin, currently considering only dev mode */
$css.ruleInjector.styleSheet.options.mergeDeclarations = false;

export class Output {
    env: Env;
    config: OutputOptions;
    filepath: string;
    cacheDir: string;

    constructor({env, config}: {env: Env; config?: Partial<OutputOptions>}) {
        this.env = env;

        this.cacheDir = getCacheDir();

        this.config = Object.assign(
            {
                // getCSSFilename = (content) => `atoms-${stringHash(content)}.css`,
                cssFilename: () => `taddy.css`,
                cssFilepath: (filename: string) =>
                    path.join(this.cacheDir, filename),
            },
            config,
        ) as OutputOptions;

        const filename = resolveFilepath(this.config.cssFilename);
        this.filepath = resolveFilepath(this.config.cssFilepath, filename);

        mkdir(this.filepath);

        // console.log('filepath', this.filepath);

        /* clean cache */
        // fs.writeFileSync(this.filepath, '');
    }

    save({
        sourceMap,
        filename,
        target,
    }: {
        sourceMap: string;
        filename: string;
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

        const localFilename = stringHash(`${filename}`) + '.taddy';

        const localFilepath = path.join(
            this.cacheDir,
            // stringHash(`${filename}:${added}`) + '.taddy.css',
            localFilename,
        );

        writeFile(
            localFilepath + '.css',
            added.join('').replace(/}$/, sourceMap + '}'),
        );

        if (target === 'remix') {
            writeFile(
                localFilepath + '.cjs',
                `require('./${localFilename}.css');`,
            );
            writeFile(localFilepath + '.js', `import './${localFilename}.css'`);

            return {importName: `@taddy/babel-plugin/cache/${localFilename}`};
        }

        return {importName: `@taddy/babel-plugin/cache/${localFilename}.css`};
    }
}
