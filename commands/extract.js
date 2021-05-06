import ora from 'ora';
import notifier from 'node-notifier';
import unzip from '../lib/unzip.js';
import log from '../lib/log.js';

export default async (argv) => {
  const {file, request} = argv;
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
      message: 'Success',
    });
  } catch (error) {
    spinner.fail();
    log.error(error);
  }
};
