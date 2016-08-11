const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const path = require('path');
const chalk = require('chalk');

const template = `
{
  "hostname": "-us-mzw.demandware.net",
  "username": "",
  "password": "",
  "version": "version1"
}
`;

module.exports = () => {
  fs.statAsync(path.join(process.cwd(), 'dw.json'))
    .then(() => {
      process.stdout.write('dw.json already exists');
    })
    .catch(() => {
      fs.writeFileAsync('dw.json', template.trim(), 'utf8').then(() => {
        process.stdout.write(chalk.green('dw.json created'));
      });
    });
};
