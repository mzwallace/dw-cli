const get = require('lodash').get;

module.exports = config => {
  const sandbox = get(config, 'sandbox');
  const sandboxConfig = get(config, `environments.${sandbox}`);
  const hostname = get(sandboxConfig, 'hostname', `${sandbox}${config.hostname}`);
  const username = get(sandboxConfig, 'username', config.username);
  const password = get(sandboxConfig, 'password', config.password);

  return Object.assign({}, config, {
    hostname,
    username,
    password,
    request: {
      baseUrl: `https://${hostname}/on/demandware.servlet/webdav/Sites/`,
      auth: {
        username,
        password
      },
      strictSSL: false
    }
  });
};
