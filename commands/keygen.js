const shell = require('shelljs');
const log = require('../lib/log');

module.exports = function ({user, crt, key, srl}) {
  log.info(`Generating a staging certificate for stage instance user account ${user}`);

  if (!shell.which('openssl')) {
    log.error('Missing openssl package, install openssl to continue (i.e. `brew install openssl`)');
    process.exit();
  }

  const userKeyCommand = `openssl req -new -newkey rsa:2048 -nodes -out ${user}.req -keyout ${user}.key -subj "/C=CO/ST=State/L=Local/O=Demandware/OU=Technology/CN=${user}"`;
  log.info(userKeyCommand);
  shell.exec(userKeyCommand, {async: false});

  const signCommand = `openssl x509 -CA '${crt}' -CAkey '${key}' -CAserial '${srl}' -req -in ${user}.req -out ${user}.pem -days 365`;
  log.info(signCommand);
  shell.exec(signCommand, {async: false});
};
