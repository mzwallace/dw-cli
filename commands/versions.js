import ora from 'ora';
import api from '../lib/api.js';
import log from '../lib/log.js';

/**
 * @param {import('../index.js').DWArgv} argv
 */
export default async (argv) => {
  const {clientId, clientPassword, hostname, apiVersion} = argv;
  log.info(`Reading code versions on ${hostname}`);
  const spinner = ora().start();

  try {
    spinner.text = 'Reading';
    const method = 'GET';
    const endpoint = `https://${hostname}/s/-/dw/data/${apiVersion}/code_versions`;
    await api({clientId, clientPassword, method, endpoint});
    const data = await api({clientId, clientPassword, method, endpoint});
    // spinner.succeed();
    log.plain('-------------------');
    for (const version of data) {
      spinner.start();
      spinner.text = version.id;
      if (version.active) {
        spinner.succeed();
      } else {
        spinner.fail();
      }
    }
    log.plain('-------------------');
    log.success('Success');
  } catch (error) {
    spinner.fail();
    log.error(error);
  }
};
