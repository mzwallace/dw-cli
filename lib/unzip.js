const request = require('request');

module.exports = (filePath = '', options = {}) => {
  let req;
  const promise = new Promise((resolve, reject) => {
    req = request(Object.assign({}, options, {
      uri: `/${filePath}`,
      method: 'POST',
      form: {
        method: 'UNZIP'
      }
    }), (err, res) => {
      if (err) {
        return reject(err);
      }
      if (res.statusCode >= 400) {
        return reject(new Error(res.statusMessage));
      }
      resolve();
    });
  });
  promise.request = req;
  return promise;
};
