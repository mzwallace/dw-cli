const path = require('path');
const chokidar = require('chokidar');
const ora = require('ora');
const notifier = require('node-notifier');
const write = require('../lib/write');
const mkdirp = require('../lib/mkdirp');
const log = require('../lib/log');

module.exports = options => {
  const {cartridges, codeVersion, webdav, request, silent = false} = options;

  try {
    log.info(`Pushing ${codeVersion} changes to ${webdav}`);

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
          notifier.notify({
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
          await mkdirp(dest, request);
          await write(src, dest, request);
          if (!silent) {
            notifier.notify({
              title: 'File Uploaded',
              message: dest
            });
          }
          if (spinner) {
            spinner.text = `${src} pushed to ${dest}`;
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
