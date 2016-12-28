const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const path = require('path');
const chalk = require('chalk');
const log = require('../lib/log');

const template = `
{
  "hostname": "-region-customer.demandware.net",
  "username": "defaultuser",
  "password": "defaultpass",

  "api-version": 'v16_6',

  "client-id": "client-id-from-account-dashboard",
  "client-password": "client-password-from-account-dashboard",

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
    log.error(`'dw.json' already exists`);
  } catch (error) {
    await fs.writeFileAsync('dw.json', template.trim(), 'utf8');
    log.success(`'dw.json' created`);
  }
};
