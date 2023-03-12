import {NameGenerator} from './NameGenerator';

const nameGenerator = new NameGenerator();

export type TaddyConfig = {
    /** map "style" and "className" to the needed value */
    unstable_mapStyles: (value: {className: string; style?: object}) => any;

    nameGenerator: NameGenerator;

    properties?: {
        [key: string]:
            | void
            | string
            | number
            | object
            | ((...args: any[]) => object | string | number | null);
    };
};

type ValidatedShape<T, Shape> = T & {
    [key in keyof T]: key extends keyof Shape ? T[key] : never;
};

declare function setConfig<T extends Partial<TaddyConfig>>(
    value: ValidatedShape<T, TaddyConfig>,
): T;

export const config: typeof setConfig & TaddyConfig = Object.assign(
    (value) => {
        Object.assign(config, value);
        return value;
    },
    {
        nameGenerator,
        unstable_mapStyles: (x) => x,
    },
);
