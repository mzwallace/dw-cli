const config = require(process.cwd() + '/dw.json');

module.exports = {
  version: global.argv.branch,
  request: {
    baseUrl: `https://${global.argv.env}${config.hostname}/on/demandware.servlet/webdav/Sites/Cartridges/`,
    auth: {
      username: config.username,
      password: config.password
    },
    strictSSL: false
  }
};
