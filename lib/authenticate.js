const request = require('request');

module.exports = ({clientId, clientPassword}) => {
  return new Promise((resolve, reject) => {
    request.post('https://account.demandware.com/dw/oauth2/access_token', {
      auth: {
        username: clientId,
        password: clientPassword
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
