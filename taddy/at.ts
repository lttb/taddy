import type {TaddyRule} from './types';

export function at(ruleName: string, query: string, rule: TaddyRule) {
    const name = `@${ruleName}`;
    return {[name + query]: {'@at': {name, query}, rule}};
}
