const fs = require('fs');
const path = require('path');
const request = require('request');

module.exports = function write(filePath = '', options = {}) {
  let req;
  const promise = new Promise((resolve, reject) => {
    const uriPath = path.relative(process.cwd(), filePath);
    const uri = `/${uriPath}`;
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
    fs.createReadStream(filePath).pipe(req);
  });
  promise.request = req;
  return promise;
};
