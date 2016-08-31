const request = require('request');
const path = require('path');
const config = require('./config')();

module.exports = (remote = '') => {
  return new Promise((resolve, reject) => {
    request(Object.assign({}, config.request, {
      uri: path.normalize(`/${remote}`),
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
};
