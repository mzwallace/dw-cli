const ora = require('ora');
const del = require('../lib/delete');
const log = require('../lib/log');

module.exports = async ({codeVersion, webdav, request}) => {
  log.info(`Removing ${codeVersion} from ${webdav}`);
  const spinner = ora();

  try {
    spinner.start();
    spinner.text = `Removing`;
    await del(`/Cartridges/${codeVersion}`, request);
    spinner.succeed();
    log.success('Success');
  } catch (err) {
    spinner.fail();
    log.error(err);
  }
};
