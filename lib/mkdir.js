const path = require('path');
const request = require('request');
const config = require('./config')();
const Promise = require('bluebird');

module.exports = opts => {
  const options = Object.assign({
    dir: '/'
  }, opts);
  return new Promise((resolve, reject) => {
    const uri = path.join('/', options.dir);
    request(Object.assign({}, config.request, {
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
