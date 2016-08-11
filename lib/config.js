const config = require(process.cwd() + '/dw.json');
const branch = require('./branch');
const get = require('lodash.get');

module.exports = {
  version: get(global, 'argv.branch') || branch() || 'master',
  request: {
    baseUrl: `https://${get(global, 'argv.env', 'dev01')}${config.hostname}/on/demandware.servlet/webdav/Sites/Cartridges/`,
    auth: {
      username: config.username,
      password: config.password
    },
    strictSSL: false
  }
};
