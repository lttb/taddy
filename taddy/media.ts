import type {TaddyRule} from './types';

export function media(media: string, rule: TaddyRule) {
    return {[media]: {'@media': media, rule}};
}
