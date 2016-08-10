const path = require('path');
const mkdirp = require('mkdirp');
const zip = require('../lib/zip');
const write = require('../lib/write');

module.exports = opts => {
  const options = Object.assign({

  }, opts);
  const src = path.join(process.cwd(), 'cartridges');
  mkdirp.sync(path.join(process.cwd(), '.tmp'));
  zip({
    src,
    dest: path.join(process.cwd(), '.tmp')
  })
  .then(file => {
    return write(file, options);
  })
  .then(dest => {
    console.log(dest);
  })
  .catch(err => {
    console.log(err);
    throw err;
  });
};
