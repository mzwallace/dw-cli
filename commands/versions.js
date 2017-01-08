const ora = require('ora');
const api = require('../lib/api');
const log = require('../lib/log');

module.exports = async ({clientId, clientPassword, hostname, apiVersion}) => {
  log.info(`Reading code versions on ${hostname}`);
  const spinner = ora().start();

  try {
    spinner.text = 'Reading';
    const method = 'get';
    const endpoint = `https://${hostname}/s/-/dw/data/${apiVersion}/code_versions`;
    const {data} = await api({clientId, clientPassword, method, endpoint});
    spinner.succeed();
    log.plain('-------------------');
    data.forEach(version => {
      spinner.start();
      spinner.text = version.id;
      if (version.active) {
        spinner.succeed();
      } else {
        spinner.fail();
      }
    });
    log.plain('-------------------');
    log.success('Success');
  } catch (err) {
    spinner.fail();
    log.error(err);
  }
};
