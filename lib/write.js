const fs = require('fs');
const path = require('path');
// const exec = require('child_process').exec;
// const {username, password, hostname} = require('../dw.json');
const request = require('request');
const cli = require('./cli');

module.exports = function write(filePath = '') {
  // const absolutePath = join(process.cwd(), filePath);
  // const relativePath = relative(process.cwd(), filePath);
  // const dir = dirname(relativePath);
  // const command = `curl -T '${absolutePath}' -H "Authorization: Basic ${(new Buffer(`${username}:${password}`)).toString('base64')}" "https://${hostname}/on/demandware.servlet/webdav/Sites/Cartridges/${dir}/"`;
  // console.log(command);
  // return new Promise(resolve => {
  //   exec(command, error => {
  //     if (error) {
  //       throw new Error(error);
  //     }
  //     resolve();
  //   });
  // });
  let req;
  const promise = new Promise((resolve, reject) => {
    const uriPath = path.relative(process.cwd(), filePath);
    req = request(Object.assign({}, cli.requestConfig, {
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
