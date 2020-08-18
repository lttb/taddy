import {NameGenerator} from './NameGenerator';

const nameGenerator = new NameGenerator();

export type TaddyConfig = {
    /** map "style" and "className" to the needed value */
    unstable__mapStyles?: (value: {
        style: object;
        className: object;
    }) => unknown;

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

type ValidatedShape<T, Shape> = T &
    {
        [key in keyof T]: key extends keyof Shape ? T[key] : never;
    };

declare function setConfig<T extends Partial<TaddyConfig>>(
    value: ValidatedShape<T, TaddyConfig>,
): T;

export const config: typeof setConfig & {
    current: TaddyConfig;
} = Object.assign(
    (value) => {
        Object.assign(config.current, value);
        return value;
    },
    {
        current: {
            nameGenerator,
            unstable__mapStyles: (x) => x,
        },
    },
);
