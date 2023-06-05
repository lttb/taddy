import {processRules} from './react-native/processStyles';

export function css(...rule) {
    return processRules(rule);
}
