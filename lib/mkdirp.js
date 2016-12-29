const {normalize} = require('path');
const Promise = require('bluebird');
const mkdir = require('./mkdir');

module.exports = function (dir = '') {
  const folders = normalize(dir).split('/').filter(f => f.length);
  return Promise.each(folders, (folder, i) => {
    let toMake = folders[i];
    if (i > 0) {
      toMake = folders.slice(0, i + 1).join('/');
    }
    return mkdir({dir: toMake});
  });
};
