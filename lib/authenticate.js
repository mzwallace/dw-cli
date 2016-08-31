const request = require('request');
const config = require('./config')();

module.exports = () => {
  return new Promise((resolve, reject) => {
    request.post('https://account.demandware.com/dw/oauth2/access_token', {
      auth: {
        username: config.client_id,
        password: config.client_password
      },
      form: {
        grant_type: 'client_credentials' // eslint-disable-line
      }
    }, (err, res, body) => {
      if (err) {
        return reject(err);
      }
      if (res.statusCode >= 400) {
        return reject(new Error(res.statusMessage));
      }
      resolve(body);
    });
  });
};
