const log = require('../lib/log');
const {execSync} = require('child_process');

module.exports = function ({user, crt, key, srl}) {
  log.info(
    `Generating a staging certificate for stage instance user account ${user}`
  );

  if (
    !execSync('which openssl', {
      stdio: ['pipe', 'pipe', 'ignore'],
      encoding: 'utf8',
    })
      .split('\n')
      .join('')
  ) {
    log.error(
      'Missing openssl package, install openssl to continue (i.e. `brew install openssl`)'
    );
    process.exit();
  }

  const userKeyCommand = `openssl req -new -newkey rsa:2048 -nodes -out ${user}.req -keyout ${user}.key -subj "/C=CO/ST=State/L=Local/O=Demandware/OU=Technology/CN=${user}"`;
  log.info(userKeyCommand);
  execSync(userKeyCommand, {encoding: 'utf8'});

  const signCommand = `openssl x509 -CA '${crt}' -CAkey '${key}' -CAserial '${srl}' -req -in ${user}.req -out ${user}.pem -days 365`;
  log.info(signCommand);
  execSync(signCommand, {encoding: 'utf8'});

  log.success('Files generated.');
};
