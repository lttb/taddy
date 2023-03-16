import {config} from './config';

export const h = (x: any) => config.nameGenerator.getHash(x);
