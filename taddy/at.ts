import type {TaddyRule, SupportedAtRulesNames} from './types';

export function at(
    ruleName: SupportedAtRulesNames,
    query: string,
    rule: TaddyRule,
) {
    const name = `@${ruleName}`;
    return {[name + query]: {'@at': {name, query}, rule}};
}
