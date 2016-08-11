const path = require('path');
const get = require('lodash.get');
const defaults = require('lodash.defaults');
const branch = require('./branch');
const config = require(path.join(process.cwd(), get(global, 'argv.config', 'dw.json')));

module.exports = () => {
  const env = get(global, 'argv.env', 'dev01');

  const envConfig = get(config, `environments.${env}`, {
    username: 'test',
    password: 'test'
  });

  const protocol = env === '' ? 'http' : 'https';

  return defaults({
    version: get(global, 'argv.branch') || branch() || 'master',
    request: {
      baseUrl: `${protocol}://${env}${config.hostname}/on/demandware.servlet/webdav/Sites/Cartridges/`,
      auth: {
        username: get(envConfig, 'username', config.username),
        password: get(envConfig, 'password', config.password)
      },
      strictSSL: false
    }
  }, config);
};
