/* eslint-disable require-atomic-updates */
import fs from 'fs-extra';
import path from 'node:path';
import ora from 'ora';
import chalk from 'chalk';
import { globby } from 'globby';
import { get } from 'lodash-es';
import notifier from 'node-notifier';
import zip from '../lib/zip.js';
import unzip from '../lib/unzip.js';
import write from '../lib/write.js';
import mkdir from '../lib/mkdir.js';
import mkdirp from '../lib/mkdirp.js';
import del from '../lib/delete.js';
import log from '../lib/log.js';
import find from '../lib/find.js';

export default async (options) => {
  const { cartridges, codeVersion, webdav, request } = options;

  try {
    fs.accessSync(cartridges);
  } catch {
    log.error(`'${cartridges}' is not a valid folder`);
    process.exit(1);
  }

  log.info(`Pushing ${codeVersion} to ${webdav}`);
  const spinner = ora();
  const destination = `Cartridges/${codeVersion}`;

  try {
    if (options.zip) {
      spinner.start();
      spinner.text = `Zipping '${cartridges}'`;
      let zipped = await zip(cartridges, get(process, 'env.TMPDIR', '.'));
      spinner.succeed();

      spinner.start();
      spinner.text = `Creating remote folder ${destination}`;
      await mkdir(destination, request);
      spinner.succeed();

      spinner.start();
      spinner.text = `Cleaning remote folder ${destination}`;
      let files = await find(destination, request);
      files = files
        .map((file) => file.displayname)
        .filter((file) => file !== codeVersion);
      await Promise.all(
        files.map((file) => del(path.join(destination, file), request))
      );
      files = await find(destination, request);
      files = files
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
      zipped = await write(zipped, destination, request, {
        onProgress({ percent, total, transferred }) {
          const sizeInMegabytes = (total / 1_000_000).toFixed(2);
          const uploadedInMegabytes = (transferred / 1_000_000).toFixed(2);
          const prettyPercent = chalk.yellow.bold(`${percent}%`);
          const prettySize = chalk.cyan.bold(`${sizeInMegabytes}MB`);
          const prettyUploaded = chalk.cyan.bold(`${uploadedInMegabytes}MB`);
          spinner.text = `Uploading ${destination}/archive.zip - ${prettyUploaded} / ${prettySize} - ${prettyPercent}`;
        },
      });
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
      const files = await globby(path.join(cartridges, '**'), {
        onlyFiles: true,
      });
      let uploaded = 0;
      const upload = async (file) => {
        try {
          const source = path.relative(process.cwd(), file);
          const directory = path
            .dirname(source)
            .replace(path.normalize(cartridges), '');
          const destination_ = path.join('Cartridges', codeVersion, directory);
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
          spinner.text = `${uploaded}/${files.length} ${filename} uploaded`;
          uploaded++;
        } catch (error) {
          spinner.text = error.message;
          spinner.fail();
        }
      };

      for (const file of files) {
        upload(file);
      }
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
