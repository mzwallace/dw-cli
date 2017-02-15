const fs = require('fs');
const ora = require('ora');
const get = require('lodash/get');
const notifier = require('node-notifier');
const zip = require('../lib/zip');
const unzip = require('../lib/unzip');
const log = require('../lib/log');

module.exports = async ({file, webdav, request}) => {

  log.info(`Extracting ${file}`);
  const spinner = ora();

  try {
    spinner.start();
    spinner.text = `Unzipping ${file}`;
    await unzip(file, request);
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
