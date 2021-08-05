import ora from 'ora';
import del from '../lib/delete.js';
import log from '../lib/log.js';
import api from '../lib/api.js';

/**
 * @param {import('../index.js').DWArgv} argv
 */
export default async (argv) => {
  const {clientId, clientPassword, hostname, apiVersion, webdav, request} =
    argv;
  log.info(`Cleaning up ${webdav}`);
  const spinner = ora();

  try {
    spinner.text = 'Reading';
    const method = 'get';
    const endpoint = `https://${hostname}/s/-/dw/data/${apiVersion}/code_versions`;
    const {data} = await api({clientId, clientPassword, method, endpoint});
    if (data.length === 1) {
      spinner.text = `Already clean`;
      spinner.succeed();
    } else {
      spinner.succeed();
      log.plain('-------------------');
      spinner.text = 'Removing';
      spinner.start();
      for (const key of Object.keys(data)) {
        const version = data[key];
        if (!version.active) {
          await del(`/Cartridges/${version.id}`, request);
          spinner.text = `Removed ${version.id}`;
          spinner.succeed();
          spinner.text = 'Removing';
          spinner.start();
        }
      }
      spinner.stop();
      log.plain('-------------------');
    }
    log.success('Success');
  } catch (error) {
    spinner.fail();
    log.error(error);
  }
};
