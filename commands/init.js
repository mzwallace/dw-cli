const path = require('path');
const fs = require('fs-extra');
const log = require('../lib/log');

module.exports = async () => {
  try {
    await fs.stat(path.join(process.cwd(), 'dw-cli.json'));
    log.error(`'dw-cli.json' already exists`);
  } catch (err) {
    const template = await fs.readFile(
      path.join(__dirname, '../dw-cli.json.example'),
      'utf8'
    );
    await fs.writeFile('dw-cli.json', template.trim(), 'utf8');
    log.success(`'dw-cli.json' created`);
  }
};
