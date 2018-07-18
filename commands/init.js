const path = require('path');
const fs = require('fs-extra');
const log = require('../lib/log');

module.exports = async () => {
  try {
    await fs.stat(path.join(process.cwd(), 'dw.json'));
    log.error(`'dw.json' already exists`);
  } catch (err) {
    const template = await fs.readFile(
      path.join(__dirname, '../dw.json.example'),
      'utf8'
    );
    await fs.writeFile('dw.json', template.trim(), 'utf8');
    log.success(`'dw.json' created`);
  }
};
