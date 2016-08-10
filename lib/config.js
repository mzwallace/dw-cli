const config = require(process.cwd() + '/dw.json');
const branch = require('../lib/branch');

module.exports = {
  version: branch(),
  request: {
    baseUrl: `https://${global.argv.env}${config.hostname}/on/demandware.servlet/webdav/Sites/Cartridges/`,
    auth: {
      username: config.username,
      password: config.password
    },
    strictSSL: false
  }
};
