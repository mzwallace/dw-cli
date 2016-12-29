const path = require('path');
const chokidar = require('chokidar');
const ora = require('ora');
const write = require('../lib/write');
const mkdirp = require('../lib/mkdirp');
const log = require('../lib/log');

module.exports = ({cartridge = 'cartridges', codeVersion}) => {
  log.info(`Watching '${cartridge}' for changes`);
  const spinner = ora().start();

  try {
    const watcher = chokidar.watch('dir', {
      ignored: [/[/\\]\./, '**/node_modules/**'],
      persistent: true,
      atomic: true
    });

    watcher.add(path.join(process.cwd(), cartridge));

    spinner.text = 'Watching';

    watcher.on('change', async filePath => {
      const src = path.relative(process.cwd(), filePath);
      const dir = path.dirname(src).replace(path.dirname(cartridge), '');
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
    });
  } catch (err) {
    log.error(err);
  }
};
