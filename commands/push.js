const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const get = require('lodash.get');
const debug = require('debug')('push');
const zip = require('../lib/zip');
const unzip = require('../lib/unzip');
const write = require('../lib/write');
const mkdir = require('../lib/mkdir');
const branch = require('../lib/branch');

module.exports = () => {
  const src = 'cartridges';
  const spinner = ora(`Deploying ${src} to ${branch()}`).start();
  zip({
    src,
    dest: path.join(get(process, 'env.TMPDIR', '.'), 'archive.zip'),
    root: src
  })
  .then(file => {
    return mkdir({
      dir: `/${branch()}`
    })
    .then(() => file)
    .catch(() => file);
  })
  .then(file => {
    debug(`Zipped ${src} to ${file}`);
    return write({
      src: file,
      dest: `/${branch()}`
    });
  })
  .then(dest => {
    debug(`Uploaded Zip ${dest}`);
    return unzip({
      filePath: dest
    }).then(() => {
      spinner.succeed();
    });
  })
  .catch(err => {
    spinner.fail();
    console.log(chalk.red(err));
    throw err;
  });
};
