const request = require('request');

module.exports = (path = '', options = {}) => {
  let req;
  const promise = new Promise((resolve, reject) => {
    req = request(Object.assign({}, options, {
      uri: `/${path}`,
      method: 'MKCOL'
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
