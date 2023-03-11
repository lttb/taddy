export const VARS_KEY = '__VARS__';

export const MIXIN_KEY = Symbol('__MIXIN__');

export const ID_KEY = Symbol('ID_KEY');

type InvalidValue = '' | false | null | void;
export function isInvalidValue(value: any): value is InvalidValue {
    return !(!!value || value === 0);
}
