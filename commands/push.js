const path = require('path');
const debug = require('debug')('push');
const mkdirp = require('mkdirp');
const zip = require('../lib/zip');
const unzip = require('../lib/unzip');
const write = require('../lib/write');
const mkdir = require('../lib/mkdir');

module.exports = opts => {
  const options = Object.assign({

  }, opts);
  const src = 'cartridges';
  mkdirp.sync(path.join(process.cwd(), 'tmp'));
  zip({
    src,
    dest: 'tmp',
    root: src
  })
  .then(file => {
    return mkdir({
      dir: `/${options.env}`
    })
    .then(() => file)
    .catch(() => file);
  })
  .then(file => {
    debug(`Zipped ${src} to ${file}`);
    return write({
      src: file,
      dest: `/${options.env}`
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
