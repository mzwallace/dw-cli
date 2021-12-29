import ora from 'ora';
import api from '../lib/api.js';
import log from '../lib/log.js';

export default async (argv) => {
  const { clientId, clientPassword, hostname, apiVersion, jobId } = argv;
  log.info(`Running job ${jobId} on ${hostname}`);
  const spinner = ora().start();

  try {
    const endpoint = `https://${hostname}/s/-/dw/data/${apiVersion}/jobs/${jobId}/executions`;
    const { id } = await api({
      clientId,
      clientPassword,
      method: 'post',
      endpoint,
      contentType: 'application/json; charset=UTF-8',
    });

    do {
      var { status } = await api({
        clientId,
        clientPassword,
        method: 'get',
        endpoint: `${endpoint}/${id}`,
        contentType: 'application/json; charset=UTF-8',
      });
      spinner.text = `Job Status: ${status}`;
    } while (['PENDING', 'RUNNING'].includes(status));

    status == 'OK' ? spinner.succeed() : spinner.fail();
    log.success('Success');
  } catch (error) {
    spinner.fail();
    log.error(error);
  }
};
