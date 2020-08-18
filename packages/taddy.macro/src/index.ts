const {createMacro} = require('babel-plugin-macros');
const {macro} = require('@taddy/babel-plugin');

// TODO: make compatible types
module.exports = createMacro(macro as any, {configName: 'taddy'});
