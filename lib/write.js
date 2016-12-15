const fs = require('fs');
const path = require('path');
const debug = require('debug')('write');
const request = require('request');

module.exports = function (opts) {
  const options = Object.assign({
    src: '',
    dest: ''
  }, opts);
  debug(`Uploading ${options.src}`);
  let req;
  const promise = new Promise((resolve, reject) => {
    const uri = path.join('/', options.dest, path.basename(options.src));
    debug(`Destination uri ${uri}`);
    req = request(Object.assign({}, global.argv.request, {
      uri,
      method: 'PUT'
    }), (err, res) => {
      if (err) {
        return reject(err);
      }
      if (res.statusCode >= 400) {
        return reject(new Error(res.statusMessage));
      }
      resolve(uri);
    });
    fs.createReadStream(options.src).pipe(req);
  });
  promise.request = req;
  return promise;
};
