const path = require('path');
const fs = require('fs-extra');
const log = require('../lib/log');

const init = {
  command: 'init',
  desc: 'Create a dw-cli.json file',
  handler: async () => {
    try {
      await fs.stat(path.join(process.cwd(), 'dw-cli.json'));
      log.error(`'dw-cli.json' already exists`);
    } catch {
      const template = await fs.readFile(
        path.join(__dirname, '../dw-cli.json.example'),
        'utf8'
      );
      await fs.writeFile('dw-cli.json', template.trim(), 'utf8');
      log.success(`'dw-cli.json' created`);
    }
  },
};

module.exports = init;
