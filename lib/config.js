const fs = require('fs');
const https = require('https');
const get = require('lodash/get');
const branch = require('./branch')();
const load = require('./load');

module.exports = argv => {
  const file = load('dw.json');
  const instance = get(file, `instances.${get(argv, 'instance')}`);
  file.hostname = `${get(argv, 'instance')}${file.hostname}`;
  const config = Object.assign({codeVersion: branch}, file, instance, argv);
  config.webdav = config.webdav || config.hostname;

  const httpsAgent = new https.Agent({
    key: config.key ? fs.readFileSync(config.key) : null,
    cert: config.cert ? fs.readFileSync(config.cert) : null,
    ca: config.ca ? fs.readFileSync(config.ca) : null,
    pfx: config.p12 ? fs.readFileSync(config.p12) : null,
    passphrase: config.passphrase ? config.passphrase : null
  });

  config.request = {
    baseURL: `https://${config.webdav}/on/demandware.servlet/webdav/Sites/`,
    auth: {
      username: config.username,
      password: config.password
    },
    httpsAgent
  };

  return config;
};
