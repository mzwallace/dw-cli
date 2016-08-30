const request = require('request');
const config = require('./config')();

module.exports = () => {
  let req;
  const promise = new Promise((resolve, reject) => {
    req = request.post('https://account.demandware.com/dw/oauth2/access_token', {
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
  promise.request = req;
  return promise;
};
