const path = require('path');
const chokidar = require('chokidar');
const ora = require('ora');
const notifier = require('node-notifier');
const write = require('../lib/write');
const mkdirp = require('../lib/mkdirp');
const log = require('../lib/log');

module.exports = ({cartridges, codeVersion, webdav, request, silent = false}) => {
  try {
    log.info(`Pushing ${codeVersion} changes to ${webdav}`);
    const text = `Watching '${cartridges}'`;
    const spinner = ora(text).start();
    const uploading = new Set();

    const watcher = chokidar.watch('dir', {
      ignored: [/[/\\]\./, '**/node_modules/**'],
      ignoreInitial: true,
      persistent: true,
      atomic: true
    });

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
        spinner.text = `${src} changed`;
        spinner.stopAndPersist();
        spinner.text = text;
        spinner.start();

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
          spinner.text = `${src} pushed to ${dest}`;
          spinner.succeed();
        } catch (err) {
          spinner.text = err.message;
          spinner.fail();
        }

        spinner.text = text;
        spinner.start();
        uploading.delete(src);
      }
    };

    watcher.on('change', upload);
    watcher.on('add', upload);
  } catch (err) {
    log.error(err);
  }
};
