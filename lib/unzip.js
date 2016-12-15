const path = require('path');
const debug = require('debug')('unzip');
const request = require('request');

module.exports = opts => {
  const options = Object.assign({
    filePath: ''
  }, opts);
  return new Promise((resolve, reject) => {
    const uri = path.join('/', options.filePath);
    debug(`Unzipping ${uri}`);
    request(Object.assign({}, global.argv.request, {
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
