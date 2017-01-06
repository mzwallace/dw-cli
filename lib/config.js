const fs = require('fs');
const path = require('path');
const {get, omitBy, isNil} = require('lodash');

function load(file) {
  let config = {};

  try {
    config = JSON.parse(fs.readFileSync(path.join(process.cwd(), file)));
  } catch (err) {}
  return config;
}

module.exports = argv => {
  argv = omitBy(argv, isNil);
  const file = load('dw.json');
  const sandbox = get(file, `environments.${get(argv, 'sandbox')}`);
  file.hostname = `${get(argv, 'sandbox')}${file.hostname}`;
  const config = Object.assign(file, sandbox, argv);

  // console.log(config);

  config.request = {
    baseUrl: `https://${config.hostname}/on/demandware.servlet/webdav/Sites/`,
    auth: {
      username: config.username,
      password: config.password
    },
    agentOptions: {
      key : config.key  ? fs.readFileSync(config.key)  : null,
      cert: config.cert ? fs.readFileSync(config.cert) : null,
      ca  : config.ca   ? fs.readFileSync(config.ca)   : null
    }
  };

  // pfx       : config.p12 ? fs.readFileSync(config.p12)   : null,
  // passphrase: config.passphrase ? config.passphrase      : null,

  return config;
};
