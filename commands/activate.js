import ora from 'ora';
import api from '../lib/api.js';
import log from '../lib/log.js';

/**
 * @param {import('../index.js').DWArgv} argv
 */
export default async (argv) => {
  const { clientId, clientPassword, hostname, apiVersion, codeVersion } = argv;
  log.info(`Activating ${codeVersion} on ${hostname}`);
  const spinner = ora().start();

  try {
    const method = 'PATCH';
    const endpoint = `https://${hostname}/s/-/dw/data/${apiVersion}/code_versions/${codeVersion}`;
    const body = { active: true };
    spinner.text = 'Activating';
    await api({ clientId, clientPassword, method, endpoint, body });
    spinner.succeed();
    log.success('Success');
  } catch (error) {
    spinner.fail();
    log.error(error);
  }
};
