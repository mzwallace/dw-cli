const fs = require('fs-extra');
const path = require('path');
const https = require('https');
const get = require('lodash/get');
const merge = require('lodash/merge');
const log = require('./log');
const codeVersion = require('./branch')();

module.exports = argv => {
  let file = path.join(process.cwd(), 'dw-cli.json');
  const oldFile = path.join(process.cwd(), 'dw.json');
  let json = {};

  if (!fs.existsSync(file) && fs.existsSync(oldFile)) {
    log.error(`'dw.json' is deprecated, please use 'dw-cli.json' for 'dw-cli'`);
    file = oldFile;
  }

  json = fs.existsSync(file) && require(file);
  if (!json) log.info(`You are not in a directory with a config file present.`);

  const instance = get(json, ['instances', argv.instance]);

  // If using an incomplete hostname
  if (json.hostname) {
    json.hostname = `${argv.instance}${json.hostname}`;
  }

  const config = merge({codeVersion}, json, instance, argv);

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
