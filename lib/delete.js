const path = require('path');
const request = require('request');

module.exports = (remote = '') => {
  return new Promise((resolve, reject) => {
    request(Object.assign({}, global.argv.request, {
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
