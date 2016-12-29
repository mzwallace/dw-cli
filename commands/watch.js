const path = require('path');
const chokidar = require('chokidar');
const ora = require('ora');
const includes = require('lodash.includes');
const pull = require('lodash.pull');
const write = require('../lib/write');
const mkdirp = require('../lib/mkdirp');
const log = require('../lib/log');

module.exports = ({cartridge = 'cartridges', codeVersion}) => {
  log.info(`Watching '${cartridge}' for changes`);
  const spinner = ora().start();
  const uploading = [];

  try {
    const watcher = chokidar.watch('dir', {
      ignored: [/[/\\]\./, '**/node_modules/**'],
      persistent: true,
      usePolling: true,
      atomic: true
    });

    watcher.add(path.join(process.cwd(), cartridge));

    spinner.text = 'Watching';

    watcher.on('change', async filePath => {
      const src = path.relative(process.cwd(), filePath);

      if (!includes(uploading, src)) {
        uploading.push(src);
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
          await mkdirp(dest);
          await write({src, dest});
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

        pull(uploading, src);
      }
    });
  } catch (err) {
    log.error(err);
  }
};
