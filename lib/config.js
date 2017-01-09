const fs = require('fs');
const path = require('path');
const {get} = require('lodash');
const branch = require('./branch')();

function load(file) {
  let config = {};

  try {
    config = JSON.parse(fs.readFileSync(path.join(process.cwd(), file)));
  } catch (err) {}
  return config;
}

module.exports = argv => {
  const file = load('dw.json');
  const instance = get(file, `instances.${get(argv, 'instance')}`);
  file.hostname = `${get(argv, 'instance')}${file.hostname}`;
  const config = Object.assign({codeVersion: branch}, file, instance, argv);
  config.webdav = config.webdav || config.hostname;

  config.request = {
    baseUrl: `https://${config.webdav}/on/demandware.servlet/webdav/Sites/`,
    auth: {
      username: config.username,
      password: config.password
    },
    agentOptions: {
      key: config.key ? fs.readFileSync(config.key) : null,
      cert: config.cert ? fs.readFileSync(config.cert) : null,
      ca: config.ca ? fs.readFileSync(config.ca) : null
    }
  };

  // pfx       : config.p12 ? fs.readFileSync(config.p12)   : null,
  // passphrase: config.passphrase ? config.passphrase      : null,

  return config;
};
