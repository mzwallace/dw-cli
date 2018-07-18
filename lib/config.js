const fs = require('fs-extra');
const path = require('path');
const https = require('https');
const get = require('lodash/get');
const merge = require('lodash/merge');
const codeVersion = require('./branch')();

module.exports = argv => {
  const dwjson = require(path.join(process.cwd(), 'dw.json'));
  const instance = get(dwjson, `cli.instances.${get(argv, 'instance')}`);
  const config = merge({codeVersion}, dwjson.cli, instance, argv);

  // If webdav isn't provided, fallback to hostname
  config.webdav = config.webdav || config.hostname;

  config.request = {
    baseURL: `https://${config.webdav}/on/demandware.servlet/webdav/Sites/`,
    auth: {
      username: config.username,
      password: config.password
    },
    httpsAgent: new https.Agent({
      key: config.key ? fs.readFileSync(config.key) : null,
      cert: config.cert ? fs.readFileSync(config.cert) : null,
      ca: config.ca ? fs.readFileSync(config.ca) : null,
      pfx: config.p12 ? fs.readFileSync(config.p12) : null,
      passphrase: config.passphrase ? config.passphrase : null
    })
  };

  return config;
};
