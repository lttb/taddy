const EVAL_FILENAME_POSTFIX = '@__TADDY_EVALUATE__';

/**
 * @param {import('@babel/core').PluginPass} state
 * @returns {boolean}
 */
function isTaddyEvaluation(state) {
    return !!state.filename?.includes(EVAL_FILENAME_POSTFIX);
}

module.exports = {EVAL_FILENAME_POSTFIX, isTaddyEvaluation};
