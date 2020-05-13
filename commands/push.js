/* eslint-disable require-atomic-updates */
const fs = require('fs-extra');
const path = require('path');
const ora = require('ora');
const chalk = require('chalk');
const globby = require('globby');
const Bluebird = require('bluebird');
const get = require('lodash/get');
const notifier = require('node-notifier');
const TaskQueue = require('cwait').TaskQueue;
const zip = require('../lib/zip');
const unzip = require('../lib/unzip');
const write = require('../lib/write');
const mkdir = require('../lib/mkdir');
const mkdirp = require('../lib/mkdirp');
const del = require('../lib/delete');
const log = require('../lib/log');
const find = require('../lib/find');

module.exports = async (options) => {
  const {cartridges, codeVersion, webdav, request} = options;

  try {
    fs.accessSync(cartridges);
  } catch {
    log.error(`'${cartridges}' is not a valid folder`);
    process.exit(1);
  }

  log.info(`Pushing ${codeVersion} to ${webdav}`);
  const spinner = ora();
  const destination = `/Cartridges/${codeVersion}`;

  try {
    let zipped;

    if (options.zip) {
      spinner.start();
      spinner.text = `Zipping '${cartridges}'`;
      zipped = await zip(cartridges, get(process, 'env.TMPDIR', '.'));
      spinner.succeed();

      spinner.start();
      spinner.text = `Creating remote folder ${destination}`;
      await mkdir(destination, request);
      spinner.succeed();

      spinner.start();
      spinner.text = `Cleaning remote folder ${destination}`;
      let files = (await find(destination, request))
        .map((file) => file.displayname)
        .filter((file) => file !== codeVersion);
      await Promise.all(
        files.map((file) => del(path.join(destination, file), request))
      );
      files = (await find(destination, request))
        .map((file) => file.displayname)
        .filter((file) => file !== codeVersion);
      await Promise.all(
        files.map((file) =>
          del(path.join(destination, file), request).catch(() => {})
        )
      ); // Sometimes it doesn't delete, so I'm doing it twice... there must be a better way...
      spinner.succeed();

      spinner.start();
      spinner.text = `Uploading ${destination}/archive.zip`;
      zipped = await write(
        zipped,
        destination,
        Object.assign({}, request, {
          onProgress({percent, size, uploaded}) {
            const sizeInMegabytes = (size / 1000000).toFixed(2);
            const uploadedInMegabytes = (uploaded / 1000000).toFixed(2);
            const prettyPercent = chalk.yellow.bold(`${percent}%`);
            const prettySize = chalk.cyan.bold(`${sizeInMegabytes}MB`);
            const prettyUploaded = chalk.cyan.bold(`${uploadedInMegabytes}MB`);
            spinner.text = `Uploading ${destination}/archive.zip - ${prettyUploaded} / ${prettySize} - ${prettyPercent}`;
          },
        })
      );
      spinner.succeed();

      spinner.start();
      spinner.text = `Unzipping ${zipped}`;
      await unzip(zipped, request);
      spinner.succeed();

      spinner.start();
      spinner.text = `Removing ${zipped}`;
      await del(zipped, request);
      spinner.succeed();
    } else {
      spinner.start();
      spinner.text = 'Uploading files individually';
      const queue = new TaskQueue(Bluebird, 800);
      const files = await globby(path.join(cartridges, '**'), {
        onlyFiles: true,
      });
      const promises = files.map((element) =>
        queue.wrap(async (file, i) => {
          try {
            const source = path.relative(process.cwd(), file);
            const directory = path
              .dirname(source)
              .replace(path.normalize(cartridges), '');
            const destination_ = path.join(
              '/',
              'Cartridges',
              codeVersion,
              directory
            );
            const filename = path.basename(source);
            try {
              await mkdirp(destination_, request);
              await write(source, destination_, request);
            } catch {
              try {
                await mkdirp(destination_, request);
                await write(source, destination_, request);
              } catch {
                await mkdirp(destination_, request);
                await write(source, destination_, request);
              }
            }
            spinner.text = `${i}/${files.length} ${filename} uploaded`;
          } catch (error) {
            spinner.text = error.message;
            spinner.fail();
          }
        })(element)
      );
      await Bluebird.all(promises);
      spinner.succeed();
    }

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
