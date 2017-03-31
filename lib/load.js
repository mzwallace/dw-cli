const fs = require('fs');
const path = require('path');
const log = require('./log');

function load(file) {
  let config = {};

  try {
    config = JSON.parse(fs.readFileSync(path.join(process.cwd(), file)));
  } catch (err) {
    if (err.message.indexOf('no such file or directory') === -1) {
      log.error(err);
    }
  }

  return config;
}

module.exports = load;
