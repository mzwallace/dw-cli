const fs = require('fs');
const ora = require('ora');
const {get} = require('lodash');
const zip = require('../lib/zip');
const unzip = require('../lib/unzip');
const write = require('../lib/write');
const mkdir = require('../lib/mkdir');
const del = require('../lib/delete');
const log = require('../lib/log');

module.exports = async ({cartridge = 'cartridges', codeVersion, webdav}) => {
  try {
    fs.accessSync(cartridge);
  } catch (err) {
    log.error(`'${cartridge}' is not a valid folder`);
    process.exit(1);
  }

  log.info(`Pushing ${codeVersion} to ${webdav}`);
  const spinner = ora();
  const dest = `/Cartridges/${codeVersion}`;

  try {
    let file;

    spinner.start();
    spinner.text = `Zipping '${cartridge}'`;
    file = await zip({
      src: cartridge,
      dest: get(process, 'env.TMPDIR', '.'),
      isSpecificCartridge: cartridge !== 'cartridges'
    });
    spinner.succeed();

    spinner.start();
    spinner.text = `Creating remote folder ${dest}`;
    await mkdir({dir: dest});
    spinner.succeed();

    spinner.start();
    spinner.text = `Uploading archive.zip to ${dest}`;
    file = await write({src: file, dest});
    spinner.succeed();

    spinner.start();
    spinner.text = `Unzipping ${file}`;
    await unzip({filePath: file});
    spinner.succeed();

    spinner.start();
    spinner.text = `Removing ${file}`;
    await del(file);
    spinner.succeed();

    log.success('Success');
  } catch (err) {
    spinner.fail();
    log.error(err);
  }
};
