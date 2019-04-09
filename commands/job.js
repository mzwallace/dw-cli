const ora = require('ora');
const api = require('../lib/api');
const log = require('../lib/log');

module.exports = async ({
  clientId,
  clientPassword,
  hostname,
  apiVersion,
  jobId
}) => {
  log.info(`Running job ${jobId} on ${hostname}`);
  const spinner = ora().start();

  try {
    const endpoint = `https://${hostname}/s/-/dw/data/${apiVersion}/jobs/${jobId}/executions`;
    const {id} = await api({
      clientId,
      clientPassword,
      method: 'post',
      endpoint,
      contentType: 'application/json; charset=UTF-8'
    });

    do {
      var {status} = await api({
        clientId,
        clientPassword,
        method: 'get',
        endpoint: `${endpoint}/${id}`,
        contentType: 'application/json; charset=UTF-8'
      });
      spinner.text = `Job Status: ${status}`;
    } while (['PENDING', 'RUNNING'].indexOf(status) !== -1);

    status == 'OK' ? spinner.succeed() : spinner.fail();
    log.success('Success');
  } catch (err) {
    spinner.fail();
    log.error(err);
  }
};
