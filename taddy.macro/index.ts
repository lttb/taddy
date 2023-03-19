import {createMacro} from 'babel-plugin-macros';
import {macro} from '@taddy/babel-plugin/macro';

// TODO: make compatible types
export default createMacro(macro as any, {configName: 'taddy'});
