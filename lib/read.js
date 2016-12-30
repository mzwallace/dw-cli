const request = require('request');

module.exports = (filePath = '') => {
  return new Promise((resolve, reject) => {
    request(Object.assign({}, global.argv.request, {
      uri: `/${filePath}`,
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
