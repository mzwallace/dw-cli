const path = require('path');
const request = require('request');
const Promise = require('bluebird');

module.exports = (dir, options) => {
  return new Promise((resolve, reject) => {
    const uri = path.join('/', dir);
    request(Object.assign({}, options, {
      uri,
      method: 'MKCOL'
    }), (err, res, body) => {
      if (err) {
        return reject(err);
      }
      if (res.statusCode === 405) {
        return resolve();
      }
      if (res.statusCode >= 400) {
        return reject(new Error(res.statusMessage));
      }
      resolve(body);
    });
  });
};
