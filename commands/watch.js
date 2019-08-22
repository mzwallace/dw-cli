/* eslint-disable require-atomic-updates */
const path = require('path');
const chokidar = require('chokidar');
const ora = require('ora');
const debounce = require('lodash/debounce');
const notifier = require('node-notifier');
const pRetry = require('p-retry');
const write = require('../lib/write');
const del = require('../lib/delete');
const mkdirp = require('../lib/mkdirp');
const log = require('../lib/log');

module.exports = options => {
  const {cartridges, codeVersion, webdav, request, silent = false} = options;

  try {
    log.info(`Pushing ${codeVersion} changes to ${webdav}`);

    const debouncedNotify = debounce(args => notifier.notify(args), 150);
    const uploading = new Set();
    const removing = new Set();
    let spinner;
    let text;

    const watcher = chokidar.watch('dir', {
      ignored: [/[/\\]\./, '**/node_modules/**'],
      ignoreInitial: true,
      persistent: true,
      atomic: true
    });

    if (options.spinner) {
      text = `Watching '${cartridges}' for ${webdav} [Ctrl-C to Cancel]`;
      spinner = ora(text).start();
    }

    watcher.add(path.join(process.cwd(), cartridges));

    const upload = async file => {
      const src = path.relative(process.cwd(), file);

      if (!uploading.has(src)) {
        uploading.add(src);
        if (!silent) {
          debouncedNotify({
            title: 'File Changed',
            message: src
          });
        }
        if (spinner) {
          spinner.stopAndPersist({text: `${src} changed`});
          spinner.text = text;
          spinner.start();
        }

        try {
          const dir = path.dirname(src).replace(path.normalize(cartridges), '');
          const dest = path.join('/', 'Cartridges', codeVersion, dir);
          const tryToMkdir = () => mkdirp(dest, request);
          const tryToWrite = () => write(src, dest, request);
          await pRetry(tryToMkdir, {retries: 5});
          await pRetry(tryToWrite, {retries: 5});
          if (!silent) {
            debouncedNotify({
              title: 'File Uploaded',
              message: `${path.basename(src)} => ${dest}`
            });
          }
          if (spinner) {
            spinner.text = `${path.basename(src)} pushed to ${dest}`;
            spinner.succeed();
          }
        } catch (err) {
          if (spinner) {
            spinner.text = err.message;
            spinner.fail();
          }
        }

        if (spinner) {
          spinner.text = text;
          spinner.start();
        }
        uploading.delete(src);
      }
    };

    const remove = async file => {
      const src = path.relative(process.cwd(), file);
      const dir = path.dirname(src).replace(path.normalize(cartridges), '');
      const dest = path.join('/', 'Cartridges', codeVersion, dir);
      const url = path.join('/', dest, path.basename(src));

      if (!removing.has(src)) {
        removing.add(src);
        if (!silent) {
          debouncedNotify({
            title: 'Local file removed',
            message: src
          });
        }
        if (spinner) {
          spinner.stopAndPersist({text: `${src} removed locally`});
          spinner.text = text;
          spinner.start();
        }

        try {
          await del(url, request);
          // const tryToRemove = () => del(url, request);
          // await pRetry(tryToRemove, {retries: 5});
          if (!silent) {
            debouncedNotify({
              title: 'Remote file removed',
              message: url
            });
          }
          if (spinner) {
            spinner.text = `${path.basename(src)} removed from ${dest}`;
            spinner.succeed();
          }
        } catch (err) {
          if (spinner) {
            spinner.text = `Couldn't remove ${url}: ${err.message}`;
            spinner.fail();
          }
        }

        if (spinner) {
          spinner.text = text;
          spinner.start();
        }
        removing.delete(src);
      }
    };

    watcher.on('change', upload);
    watcher.on('add', upload);
    watcher.on('unlink', remove);
  } catch (err) {
    log.error(err);
  }
};
