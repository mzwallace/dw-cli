const request = require('request');
const parseString = require('xml2js').parseString;
const config = require('./config');

module.exports = (filePath = '') => {
  let req;
  const promise = new Promise((resolve, reject) => {
    req = request(Object.assign({}, config.request, {
      headers: {
        Depth: 1
      },
      uri: `/${filePath}`,
      method: 'PROPFIND'
    }), (err, res, body) => {
      if (err) {
        return reject(err);
      }
      if (res.statusCode >= 400) {
        return reject(new Error(res.statusMessage));
      }
      parseString(body, (err, res) => {
        if (err) {
          return reject(err);
        }
        resolve(res.multistatus.response.map(d => d.href[0]));
      });
    });
  });
  promise.request = req;
  return promise;
};
