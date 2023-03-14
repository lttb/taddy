import type {TaddyRule} from './types';

export function at(name: string, query: string, rule: TaddyRule) {
    return {[name + query]: {'@at': {name, query}, rule}};
}
