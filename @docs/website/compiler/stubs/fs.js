const {fs} = require('filer');

const noop = () => void 0;

fs.writeFileSync = (...args) => fs.writeFile(...args, noop);
fs.existsSync = (...args) => fs.exists(...args, noop);
fs.readFileSync = (...args) => fs.readFile(...args, noop);
fs.appendFileSync = (...args) => fs.appendFile(...args, noop);
fs.mkdirSync = (...args) => fs.mkdir(...args, noop);

module.exports = fs;
