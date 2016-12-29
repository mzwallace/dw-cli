const path = require('path');
const fs = require('fs');
const Promise = require('bluebird');
const log = require('../lib/log');

const fsAsync = Promise.promisifyAll(fs);

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
    await fsAsync.statAsync(path.join(process.cwd(), 'dw.json'));
    log.error(`'dw.json' already exists`);
  } catch (err) {
    await fsAsync.writeFileAsync('dw.json', template.trim(), 'utf8');
    log.success(`'dw.json' created`);
  }
};
