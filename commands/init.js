const path = require('path');
const fs = require('fs');
const Promise = require('bluebird');
const log = require('../lib/log');

const fsAsync = Promise.promisifyAll(fs);

const template = fs.readFileSync(path.join(__dirname, '../dw.json.example'));

module.exports = async () => {
  try {
    await fsAsync.statAsync(path.join(process.cwd(), 'dw.json'));
    log.error(`'dw.json' already exists`);
  } catch (err) {
    await fsAsync.writeFileAsync('dw.json', template.trim(), 'utf8');
    log.success(`'dw.json' created`);
  }
};
