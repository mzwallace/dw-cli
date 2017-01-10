const ora = require('ora');
const Promise = require('bluebird');
const del = require('../lib/delete');
const log = require('../lib/log');
const api = require('../lib/api');

module.exports = async ({clientId, clientPassword, hostname, apiVersion, webdav, request}) => {
  log.info(`Removing all inactive code versions from ${webdav}`);
  const spinner = ora();

  try {
    spinner.text = 'Reading';
    const method = 'get';
    const endpoint = `https://${hostname}/s/-/dw/data/${apiVersion}/code_versions`;
    const {data} = await api({clientId, clientPassword, method, endpoint});
    spinner.succeed();
    if (data.length === 1) {
      return log.info(`${data[0].id} is the only version`);
    }
    log.plain('-------------------');
    spinner.text = 'Removing';
    spinner.start();
    await Promise.map(data, async version => {
      if (!version.active) {
        await del(`/Cartridges/${version.id}`, request);
        spinner.text = `Removed ${version.id}`;
        spinner.succeed();
        spinner.text = 'Removing';
        spinner.start();
      }
    });
    spinner.stop();
    log.plain('-------------------');
    log.success('Success');
  } catch (err) {
    spinner.fail();
    log.error(err);
  }
};
