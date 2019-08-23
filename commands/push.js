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
const move = require('../lib/move');
const del = require('../lib/delete');
const log = require('../lib/log');

module.exports = async options => {
  const {cartridges, codeVersion, webdav, request} = options;
  try {
    fs.accessSync(cartridges);
  } catch (err) {
    log.error(`'${cartridges}' is not a valid folder`);
    process.exit(1);
  }

  log.info(`Pushing ${codeVersion} to ${webdav}`);
  const spinner = ora();
  const dest = `/Cartridges/${codeVersion}`;
  const temp = `/Cartridges/temp`;

  try {
    let file;

    if (options.zip) {
      spinner.start();
      spinner.text = `Zipping '${cartridges}'`;
      file = await zip(cartridges, get(process, 'env.TMPDIR', '.'));
      spinner.succeed();

      spinner.start();
      spinner.text = `Creating temporary remote folder ${temp}`;
      await mkdir(temp, request);
      spinner.succeed();

      spinner.start();
      spinner.text = `Creating remote folder ${dest}`;
      await mkdir(dest, request);
      spinner.succeed();

      spinner.start();
      spinner.text = `Uploading ${temp}/archive.zip`;
      file = await write(
        file,
        temp,
        Object.assign({}, request, {
          onProgress({percent, size, uploaded}) {
            const sizeInMegabytes = (size / 1000000.0).toFixed(2);
            const uploadedInMegabytes = (uploaded / 1000000.0).toFixed(2);
            const prettyPercent = chalk.yellow.bold(`${percent}%`);
            const prettySize = chalk.cyan.bold(`${sizeInMegabytes}MB`);
            const prettyUploaded = chalk.cyan.bold(`${uploadedInMegabytes}MB`);
            spinner.text = `Uploading ${temp}/archive.zip - ${prettyUploaded} / ${prettySize} - ${prettyPercent}`;
          }
        })
      );
      spinner.succeed();

      spinner.start();
      spinner.text = `Unzipping ${file}`;
      await unzip(file, request);
      spinner.succeed();

      spinner.start();
      spinner.text = `Removing ${file}`;
      await del(file, request);
      spinner.succeed();

      spinner.start();
      spinner.text = `Renaming ${dest} => ${dest}_old`;
      await move(dest, `${dest}_old`, request);
      spinner.succeed();

      spinner.start();
      spinner.text = `Renaming ${temp} => ${dest}`;
      await move(temp, dest, request);
      spinner.succeed();

      try {
        spinner.start();
        spinner.text = `Removing temporary remote folder ${dest}_old`;
        await del(`${dest}_old`, request).then(() =>
          del(`${dest}_old`, request)
        ); // Sometimes it doesn't delete, so I'm doing it twice... there must be a better way...
        spinner.succeed();
      } catch (error) {}
    } else {
      spinner.start();
      spinner.text = 'Uploading files individually';
      const queue = new TaskQueue(Bluebird, 800);
      const files = await globby(path.join(cartridges, '**'), {
        onlyFiles: true
      });
      const promises = files.map(
        queue.wrap(async (file, i) => {
          try {
            const src = path.relative(process.cwd(), file);
            const dir = path
              .dirname(src)
              .replace(path.normalize(cartridges), '');
            const dest = path.join('/', 'Cartridges', codeVersion, dir);
            const filename = path.basename(src);
            try {
              await mkdirp(dest, request);
              await write(src, dest, request);
            } catch (err) {
              try {
                await mkdirp(dest, request);
                await write(src, dest, request);
              } catch (err) {
                await mkdirp(dest, request);
                await write(src, dest, request);
              }
            }
            spinner.text = `${i}/${files.length} ${filename} uploaded`;
          } catch (err) {
            spinner.text = err.message;
            spinner.fail();
          }
        })
      );
      await Bluebird.all(promises);
      spinner.succeed();
    }

    log.success('Success');
    notifier.notify({
      title: 'Push',
      message: 'Success'
    });
  } catch (err) {
    spinner.fail();
    log.error(err);
  }
};
