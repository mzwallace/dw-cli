const path = require('path');
const fs = require('fs');
const log = require('../lib/log');
const load = require('../lib/load');
const get = require('lodash/get');
const shell = require('shelljs');

module.exports = function ({user, crt, key, srl}) {
  log.info(`Generating a staging certificate for stage instance user account ${user}`);

  if ( ! shell.which('openssl')) {
    log.error('Missing openssl package, install openssl to continue (i.e. `brew install openssl`)');
    process.exit();
  }

  // if ( ! path) {
  //   const config = load('dw.json');
  //   path = get(config, 'instances.stage.ca');
  //
  //   if ( ! path) {
  //     log.error('Could not determine staging certificate file path');
  //     process.exit();
  //   }
  // }
  //
  // try {
  //   const file = fs.readFileSync(path);
  //   log.info(`Found staging certificate at ${path}`);
  // } catch (e) {
  //   log.error(`Could not read staging certificate from ${path}`);
  //   process.exit();
  // }

  const userKeyCommand = `openssl req -new -newkey rsa:2048 -nodes -out ${user}.req -keyout ${user}.key -subj "/C=CO/ST=State/L=Local/O=Demandware/OU=Technology/CN=${user}"`;
  log.info(userKeyCommand);
  shell.exec(userKeyCommand, {async: false});

  const signCommand = `openssl x509 -CA '${crt}' -CAkey '${key}' -CAserial '${srl}' -req -in ${user}.req -out ${user}.pem -days 365`;
  log.info(signCommand);
  shell.exec(signCommand, {async: false});
};
