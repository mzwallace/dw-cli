const path = require('path');
const chokidar = require('chokidar');
const ora = require('ora');
const write = require('../lib/write');
const mkdirp = require('../lib/mkdirp');
const log = require('../lib/log');

module.exports = ({cartridge = 'cartridges', codeVersion, webdav}) => {
  log.info(`Pushing ${codeVersion} changes to ${webdav}`);
  const text = `Watching '${cartridge}'`;
  const spinner = ora(text).start();
  const uploading = new Set();

  try {
    const watcher = chokidar.watch('dir', {
      ignored: [/[/\\]\./, '**/node_modules/**'],
      ignoreInitial: true,
      persistent: true,
      usePolling: true,
      atomic: true
    });

    watcher.add(path.join(process.cwd(), cartridge));

    const upload = async filePath => {
      const src = path.relative(process.cwd(), filePath);

      if (!uploading.has(src)) {
        uploading.add(src);
        spinner.text = `${src} changed`;
        spinner.stopAndPersist();
        spinner.text = text;
        spinner.start();

        let dir = path.dirname(src).replace(path.dirname(cartridge), '');

        if (cartridge === 'cartridges') {
          dir = dir.replace('cartridges/', '');
        }

        try {
          const dest = `Cartridges${path.join('/', codeVersion, dir)}`;
          await mkdirp(dest);
          await write({src, dest});
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
