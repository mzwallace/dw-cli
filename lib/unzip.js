const path = require('path');
const debug = require('debug')('unzip');
const request = require('request');

module.exports = opts => {
  const options = Object.assign({
    filePath: ''
  }, opts);
  let req;
  const promise = new Promise((resolve, reject) => {
    const uri = path.join('/', options.filePath);
    debug(`Unzipping ${uri}`);
    req = request(Object.assign({}, options, {
      uri,
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
