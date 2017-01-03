const path = require('path');
const chokidar = require('chokidar');
const ora = require('ora');
const write = require('../lib/write');
const mkdirp = require('../lib/mkdirp');
const log = require('../lib/log');

module.exports = ({cartridge = 'cartridges', codeVersion}) => {
  log.info(`Watching '${cartridge}' for changes`);
  const spinner = ora().start();
  const uploading = new Set();

  try {
    const watcher = chokidar.watch('dir', {
      ignored: [/[/\\]\./, '**/node_modules/**'],
      ignoreInitial: true,
      persistent: true,
      usePolling: true,
      atomic: true
    });

    const upload = async filePath => {
      const src = path.relative(process.cwd(), filePath);

      if (!uploading.has(src)) {
        uploading.add(src);
        let dir;

        if (cartridge === 'cartridges') {
          dir = path.dirname(src).replace(path.dirname(cartridge), '').replace('cartridges/', '');
        } else {
          dir = path.dirname(src).replace(path.dirname(cartridge), '');
        }

        const dest = path.join('/', codeVersion, dir);

        spinner.text = `${src} changed`;
        spinner.stopAndPersist();
        spinner.text = 'Watching';
        spinner.start();

        try {
          await mkdirp(`Cartridges/${dest}`);
          await write({src, dest: `Cartridges/${dest}`});
          spinner.text = `${src} uploaded`;
          spinner.succeed();
          spinner.text = 'Watching';
          spinner.start();
        } catch (err) {
          spinner.text = err.message;
          spinner.fail();
          spinner.text = 'Watching';
          spinner.start();
        }

        uploading.delete(src);
      }
    };

    watcher.add(path.join(process.cwd(), cartridge));
    spinner.text = 'Watching';
    watcher.on('change', upload);
    watcher.on('add', upload);
  } catch (err) {
    log.error(err);
  }
};
