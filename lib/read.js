const exec = require('child_process').exec;
const {username, password, hostname} = require('../dw.json');

module.exports = function read(filePath = '') {
  const command = `curl -H "Authorization: Basic ${(new Buffer(`${username}:${password}`)).toString('base64')}" "https://${hostname}/on/demandware.servlet/webdav/Sites/Cartridges/${filePath}/"`;
  console.log(command);
  return new Promise(resolve => {
    exec(command, (error, stdout) => {
      if (error) {
        throw new Error(error);
      }
      resolve(stdout);
    });
  });
};
