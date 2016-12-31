const path = require('path');
const fs = require('fs');
const Promise = require('bluebird');
const log = require('../lib/log');

const fsAsync = Promise.promisifyAll(fs);

module.exports = async () => {
  try {
    await fsAsync.statAsync(path.join(process.cwd(), 'dw.json'));
    log.error(`'dw.json' already exists`);
  } catch (err) {
    const template = await fsAsync.readFileAsync(path.join(__dirname, '../dw.json.example'), 'utf8');
    await fsAsync.writeFileAsync('dw.json', template.trim(), 'utf8');
    log.success(`'dw.json' created`);
  }
};
