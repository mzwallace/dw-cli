const request = require('request');

module.exports = (file, options) => {
  return new Promise((resolve, reject) => {
    request(Object.assign({}, options, {
      uri: `/${file}`,
      method: 'GET'
    }), (err, res) => {
      if (err) {
        return reject(err);
      }
      if (res.statusCode >= 400) {
        return reject(new Error(res.statusMessage));
      }
      resolve(res.body);
    });
  });
};
