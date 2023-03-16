import type {PluginPass} from '@babel/core';

export const EVAL_FILENAME_POSTFIX = '@__TADDY_EVALUATE__';

export function isTaddyEvaluation(state: PluginPass): boolean {
    return !!state.filename?.includes(EVAL_FILENAME_POSTFIX);
}
