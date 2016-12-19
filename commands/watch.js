const path = require('path');
const chalk = require('chalk');
const chokidar = require('chokidar');
const write = require('../lib/write');
const mkdirp = require('../lib/mkdirp');
const log = require('../lib/log');

module.exports = ({cartridge, codeVersion}) => {
  const watcher = chokidar.watch('dir', {
    ignored: [
      /[/\\]\./,
      '**/node_modules/**'
    ],
    persistent: true,
    atomic: true
  });

  log.info(`Watching '${cartridge}' for changes\n`);

  watcher.add(path.join(process.cwd(), cartridge));

  // One-liner for current directory, ignores .dotfiles
  watcher.on('change', async filePath => {
    const src = path.relative(process.cwd(), filePath);
    const dir = path.dirname(src).replace(path.dirname(cartridge), '');
    const dest = path.join('/', codeVersion, dir);
    log.info(`${src} changed, uploading`);
    try {
      await mkdirp(dest);
      await write({src, dest});
      log.success(`${src} uploaded`);
    } catch (err) {
      process.stdout.write(chalk.red(`${err}\n`));
      process.exit(1);
    }
  });
};
