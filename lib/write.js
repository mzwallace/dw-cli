const fs = require('fs');
const path = require('path');
const debug = require('debug')('write');
const request = require('request');

module.exports = function (src, dest, options) {
  debug(`Uploading ${src}`);
  let req;

  const promise = new Promise((resolve, reject) => {
    const uri = path.join('/', dest, path.basename(src));
    debug(`Destination uri ${uri}`);

    req = request(Object.assign({}, options, {
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

    fs.createReadStream(src).pipe(req);
  });

  promise.request = req;
  return promise;
};
