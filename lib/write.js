const fs = require('fs');
const path = require('path');
const request = require('request');

module.exports = function write(filePath = '', options = {}) {
  let req;
  const promise = new Promise((resolve, reject) => {
    const uriPath = path.relative(process.cwd(), filePath);
    req = request(Object.assign({}, options, {
      uri: `/${uriPath}`,
      method: 'PUT'
    }), (err, res, body) => {
      if (err) {
        return reject(err);
      }
      if (res.statusCode >= 400) {
        return reject(new Error(res.statusMessage));
      }
      resolve(body);
    });
    fs.createReadStream(filePath).pipe(req);
  });
  promise.request = req;
  return promise;
};
