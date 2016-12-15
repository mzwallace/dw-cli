const fs = require('fs');
const chalk = require('chalk');
const ora = require('ora');
const get = require('lodash.get');
const zip = require('../lib/zip');
const unzip = require('../lib/unzip');
const write = require('../lib/write');
const mkdir = require('../lib/mkdir');
const del = require('../lib/delete');
const log = require('../lib/log');

module.exports = async argv => {
  const {cartridge = 'cartridges', codeVersion} = argv;
  try {
    fs.accessSync(cartridge);
  } catch (err) {
    throw new Error(`${cartridge} is not a valid folder`);
  }

  log.info(`Deploying ${cartridge} to ${codeVersion}\n`);

  const spinner = ora().start();

  try {
    spinner.text = `Zipping ${cartridge}`;
    const file = await zip({
      src: cartridge,
      dest: get(process, 'env.TMPDIR', '.'),
      inFolder: cartridge !== 'cartridges'
    });
    spinner.text = `Zipped ${cartridge} to ${file}`;

    spinner.text = 'Creating remote folder';
    await mkdir({
      dir: `/${codeVersion}`
    });

    spinner.text = 'Uploading';
    const dest = await write({
      src: file,
      dest: `/${codeVersion}`
    });

    spinner.text = `Uploaded Zip ${dest}`;

    spinner.text = 'Unzipping';
    await unzip({filePath: dest});

    spinner.succeed();
    process.stdout.write(chalk.green('Success\n'));
    await del(dest);
    process.exit();
  } catch (err) {
    spinner.fail();
    log.error(err);
    process.exit(1);
    throw err;
  }
};
