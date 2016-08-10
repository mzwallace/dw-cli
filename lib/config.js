const config = require(process.cwd() + '/dw.json');

module.exports = {
  request: {
    baseUrl: 'https://' + config.hostname + '/on/demandware.servlet/webdav/Sites/Cartridges/',
    auth: {
      username: config.username,
      password: config.password
    },
    strictSSL: false
  }
};
