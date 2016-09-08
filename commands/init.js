const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const path = require('path');
const chalk = require('chalk');

const template = `
{
  "hostname": "",
  "username": "",
  "password": "",

  "client_id": "",
  "client_password": "",

  "environments": {
    "dev01": {
      "username": "",
      "password": ""
    }
  }
}
`;

module.exports = () => {
  return fs.statAsync(path.join(process.cwd(), 'dw.json'))
    .then(() => {
      process.stdout.write(chalk.red(`${chalk.underline('dw.json')} already exists`));
      process.exit();
    })
    .catch(() => {
      fs.writeFileAsync('dw.json', template.trim(), 'utf8')
        .then(() => {
          process.stdout.write(chalk.green(`${chalk.underline('dw.json')} created`));
          process.exit();
        })
        .catch(() => {
          process.exit(1);
        });
    });
};
