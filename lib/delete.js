const request = require('request');
const config = require('./config')();

module.exports = (path = '') => {
  let req;
  const promise = new Promise((resolve, reject) => {
    req = request(Object.assign({}, config.request, {
      uri: `/${path}`,
      method: 'DELETE'
    }), (err, res, body) => {
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
