const path = require('path');
const debug = require('debug')('unzip');
const request = require('request');

module.exports = (file, options) => {
  return new Promise((resolve, reject) => {
    const uri = path.join('/', file);
    debug(`Unzipping ${uri}`);
    request(Object.assign({}, options, {
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
};
