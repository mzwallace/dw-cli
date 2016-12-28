const path = require('path');
const chalk = require('chalk');
const chokidar = require('chokidar');
const write = require('../lib/write');
const mkdirp = require('../lib/mkdirp');
const log = require('../lib/log');
const ora = require('ora');

module.exports = ({cartridge, codeVersion}) => {
  log.info(`Watching '${cartridge}' for changes`);
  const spinner = ora().start();

  const watcher = chokidar.watch('dir', {
    ignored: [/[/\\]\./, '**/node_modules/**'],
    persistent: true,
    atomic: true
  });

  watcher.add(path.join(process.cwd(), cartridge));

  watcher.on('change', async filePath => {
    const src = path.relative(process.cwd(), filePath);
    const dir = path.dirname(src).replace(path.dirname(cartridge), '');
    const dest = path.join('/', codeVersion, dir);

    spinner.start()
    spinner.text = `${src} changed, uploading`;

    try {
      await mkdirp(dest);
      await write({src, dest});
      spinner.text = `${src} uploaded`;
      spinner.suceed();
    } catch (err) {
      spinner.fail();
      log.error(`${err}`);
      process.exit(1);
    }
  });
};
