const git = require('git-rev-sync');
const config = require(process.cwd() + '/dw.json');

module.exports = {
  version: git.branch(),
  request: {
    baseUrl: `https://${global.argv.env}${config.hostname}/on/demandware.servlet/webdav/Sites/Cartridges/`,
    auth: {
      username: config.username,
      password: config.password
    },
    strictSSL: false
  }
};
