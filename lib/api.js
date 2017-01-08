const request = require('request');
const authenticate = require('../lib/authenticate');

module.exports = async ({clientId, clientPassword, method, endpoint, body}) => {
  const token = await authenticate({clientId, clientPassword});

  return new Promise((resolve, reject) => {
    request[method](endpoint, {auth: {bearer: token}, json: true, body}, (err, res, body) => {
      if (err) {
        return reject(err);
      }
      if (res.statusCode >= 400) {
        return reject(res.body.fault.message);
      }
      resolve(body);
    });
  });
};
