const config = require(process.cwd() + '/dw.json');
const branch = require('./branch');
const get = require('lodash.get');
const defaults = require('lodash.defaults');

module.exports = () => {
  const env = get(global, 'argv.env', 'dev01');
  const envConfig = get(config, `environments.${env}`, {});

  return defaults({
    version: get(global, 'argv.branch') || branch() || 'master',
    request: {
      baseUrl: `https://${env}${config.hostname}/on/demandware.servlet/webdav/Sites/Cartridges/`,
      auth: {
        username: get(envConfig, 'username', config.username),
        password: get(envConfig, 'password', config.password)
      },
      strictSSL: false
    }
  }, config);
};
