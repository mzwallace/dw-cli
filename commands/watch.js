const path = require('path');
const chokidar = require('chokidar');
const ora = require('ora');
const debounce = require('lodash/debounce');
const notifier = require('node-notifier');
const pRetry = require('p-retry');
const write = require('../lib/write');
const mkdirp = require('../lib/mkdirp');
const log = require('../lib/log');

module.exports = options => {
  const {cartridges, codeVersion, webdav, request, silent = false} = options;

  try {
    log.info(`Pushing ${codeVersion} changes to ${webdav}`);

    const debouncedNotify = debounce(args => notifier.notify(args), 150);
    const uploading = new Set();
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

    watcher.on('change', upload);
    watcher.on('add', upload);
  } catch (err) {
    log.error(err);
  }
};
