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

module.exports = async () => {
  const src = global.argv.folder;
  const branch = global.argv.branch;

  try {
    fs.accessSync(src);
  } catch (err) {
    throw new Error(`${src} is not a valid folder`);
  }

  const spinner = ora(`Deploying ${src} to ${branch}`).start();

  try {
    spinner.text = `Zipping ${src}`;
    const file = await zip({
      src,
      dest: path.join(get(process, 'env.TMPDIR', '.'), 'archive.zip'),
      root: src
    });
    spinner.text = `Zipped ${src} to ${file}`;

    spinner.text = 'Creating remote folder';
    await mkdir({
      dir: `/${branch}`
    });

    spinner.text = 'Uploading';
    const dest = await write({
      src: file,
      dest: `/${branch}`
    });

    spinner.text = `Uploaded Zip ${dest}`;

    spinner.text = 'Unzipping';
    await unzip({filePath: dest});

    spinner.succeed();
    process.stdout.write(chalk.green('Success\n'));
    del(dest);
    process.exit();
  } catch (err) {
    spinner.fail();
    console.log(chalk.red(err));
    process.exit(1);
    throw err;
  }
};
