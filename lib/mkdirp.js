const {normalize} = require('path');
const Promise = require('bluebird');
const mkdir = require('./mkdir');

module.exports = (dir, options) => {
  const folders = normalize(dir).split('/').filter(folder => folder.length);
  return Promise.each(folders, (folder, i) => {
    if (i > 0) {
      folder = folders.slice(0, i + 1).join('/');
    }
    return mkdir(folder, options);
  });
};
