import {config} from './config';

export const h = (x) => config.nameGenerator.getHash(x);
