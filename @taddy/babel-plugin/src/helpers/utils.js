export const EVAL_FILENAME_POSTFIX = '@__TADDY_EVALUATE__';

/**
 * @param {import('@babel/core').PluginPass} state
 * @returns {boolean}
 */
export function isTaddyEvaluation(state) {
    return !!state.filename?.includes(EVAL_FILENAME_POSTFIX);
}
