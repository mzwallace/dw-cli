const request = require('request');
const parseString = require('xml2js').parseString;

module.exports = (filePath = '') => {
  return new Promise((resolve, reject) => {
    request(Object.assign({}, global.argv.request, {
      uri: `/${filePath}`,
      method: 'GET'
    }), (err, res, body) => {
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
