import ora from 'ora';
import del from '../lib/delete.js';
import log from '../lib/log.js';

export default async (argv) => {
  const { codeVersion, webdav, request } = argv;
  log.info(`Removing ${codeVersion} from ${webdav}`);
  const spinner = ora();

  try {
    spinner.start();
    spinner.text = `Removing`;
    await del(`Cartridges/${codeVersion}`, request);
    spinner.succeed();
    log.success('Success');
  } catch (error) {
    spinner.fail();
    log.error(error);
  }
};
