const path = require('path');
const debug = require('debug')('push');
const mkdirp = require('mkdirp');
const zip = require('../lib/zip');
const unzip = require('../lib/unzip');
const write = require('../lib/write');

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
    debug(`Zipped ${src} to ${file}`);
    return write(Object.assign({
      src: file,
      dest: `/${options.env}`
    }, options));
  })
  .then(dest => {
    debug(`Uploaded Zip ${dest}`);
    return unzip(Object.assign({
      filePath: dest
    }, options));
  })
  .catch(err => {
    console.log(err);
    throw err;
  });
};
