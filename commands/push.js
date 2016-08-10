const path = require('path');
const git = require('git-rev-sync');
const get = require('lodash.get');
const debug = require('debug')('push');
const zip = require('../lib/zip');
const unzip = require('../lib/unzip');
const write = require('../lib/write');
const mkdir = require('../lib/mkdir');

const branch = git.branch();

module.exports = () => {
  const src = 'cartridges';
  zip({
    src,
    dest: path.join(get(process, 'env.TMPDIR', '.'), 'archive.zip'),
    root: src
  })
  .then(file => {
    return mkdir({
      dir: `/${branch}`
    })
    .then(() => file)
    .catch(() => file);
  })
  .then(file => {
    debug(`Zipped ${src} to ${file}`);
    return write({
      src: file,
      dest: `/${branch}`
    });
  })
  .then(dest => {
    debug(`Uploaded Zip ${dest}`);
    return unzip({
      filePath: dest
    });
  })
  .catch(err => {
    console.log(err);
    throw err;
  });
};
