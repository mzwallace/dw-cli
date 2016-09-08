const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const get = require('lodash.get');
const debug = require('debug')('push');
const zip = require('../lib/zip');
const unzip = require('../lib/unzip');
const write = require('../lib/write');
const mkdir = require('../lib/mkdir');
const del = require('../lib/delete');

module.exports = () => {
  const src = global.argv.folder;
  const branch = global.argv.branch;

  try {
    fs.accessSync(src);
  } catch (err) {
    throw new Error(`${src} is not a valid folder`);
  }

  const spinner = ora(`Deploying ${src} to ${branch}`).start();

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
    }).then(() => {
      spinner.succeed();
      process.stdout.write(chalk.green('Success'));
      del(dest);
      process.exit();
    });
  })
  .catch(err => {
    spinner.fail();
    console.log(chalk.red(err));
    process.exit(1);
    throw err;
  });
};
