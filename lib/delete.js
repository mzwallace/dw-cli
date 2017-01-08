const path = require('path');
const request = require('request');

module.exports = (file, options) => {
  return new Promise((resolve, reject) => {
    request(Object.assign({}, options, {
      uri: path.normalize(`/${file}`),
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
