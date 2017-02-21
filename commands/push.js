const fs = require('fs');
const ora = require('ora');
const get = require('lodash/get');
const notifier = require('node-notifier');
const zip = require('../lib/zip');
const unzip = require('../lib/unzip');
const write = require('../lib/write');
const mkdir = require('../lib/mkdir');
const del = require('../lib/delete');
const log = require('../lib/log');

module.exports = async ({cartridges, codeVersion, webdav, request}) => {
  try {
    fs.accessSync(cartridges);
  } catch (err) {
    log.error(`'${cartridges}' is not a valid folder`);
    process.exit(1);
  }

  log.info(`Pushing ${codeVersion} to ${webdav}`);
  const spinner = ora();
  const dest = `/Cartridges/${codeVersion}`;

  try {
    let file;

    spinner.start();
    spinner.text = `Zipping '${cartridges}'`;
    file = await zip(cartridges, get(process, 'env.TMPDIR', '.'));
    spinner.succeed();

    spinner.start();
    spinner.text = `Creating remote folder ${dest}`;
    await mkdir(dest, request);
    spinner.succeed();

    spinner.start();
    spinner.text = `Uploading ${dest}/archive.zip`;
    file = await write(file, dest, request);
    spinner.succeed();

    spinner.start();
    spinner.text = `Unzipping ${file}`;
    await unzip(file, request);
    spinner.succeed();

    spinner.start();
    spinner.text = `Removing ${file}`;
    await del(file, request);
    spinner.succeed();

    log.success('Success');
    notifier.notify({
      title: 'Push',
      message: 'Success'
    });
  } catch (err) {
    spinner.fail();
    log.error(err);
  }
};
