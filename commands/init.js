const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const path = require('path');
const chalk = require('chalk');

const template = `
{
  "hostname": "-region-customer.demandware.net",
  "username": "defaultuser",
  "password": "defaultpass",

  "api_version": 'v16_6',

  "client_id": "client-id-from-account-dashboard",
  "client_password": "client-password-from-account-dashboard",

  "environments": {
    "dev01": {
      "username": "dev01user",
      "password": "dev01pass"
    },

    "staging": {
      "certificate": "./staging.crt",
      "username": "staginguser",
      "password": "stagingpass"
    }
  }
}
`;

module.exports = async () => {
  try {
    await fs.statAsync(path.join(process.cwd(), 'dw.json'));
    process.stdout.write(chalk.red(`${chalk.underline('dw.json')} already exists`));
    process.exit();
  } catch (error) {
    await fs.writeFileAsync('dw.json', template.trim(), 'utf8');
    process.stdout.write(chalk.green(`${chalk.underline('dw.json')} created`));
    process.exit();
  }
};
