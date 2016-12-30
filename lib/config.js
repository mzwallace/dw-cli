const fs = require('fs');
const path = require('path');
const {get, omitBy, isNil} = require('lodash');

function loadConfig(file) {
  let config = {};
  try {
    config = JSON.parse(fs.readFileSync(path.join(process.cwd(), file)));
  } catch (err) {}
  return config;
}

module.exports = argv => {
  argv = omitBy(argv, isNil);
  const file = loadConfig('dw.json');
  const sandbox = get(file, `environments.${get(argv, 'sandbox')}`);
  file.hostname = `${get(argv, 'sandbox')}${file.hostname}`;

  const config = Object.assign(file, sandbox, argv);

  config.request = {
    baseUrl: `https://${config.hostname}/on/demandware.servlet/webdav/Sites/`,
    auth: {
      username: config.username,
      password: config.password
    },
    strictSSL: false
  };

  return config;
};
