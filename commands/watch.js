const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const chokidar = require('chokidar');
const write = require('../lib/write');
const mkdirp = require('../lib/mkdirp');
const branch = require('../lib/branch');

module.exports = () => {
  const watcher = chokidar.watch('dir', {
    ignored: /[/\\]\./,
    persistent: true,
    atomic: true
  });

  console.log(chalk.blue(`Watching 'cartridges' for changes`));

  watcher.add(path.join(process.cwd(), 'cartridges'));

  // One-liner for current directory, ignores .dotfiles
  watcher.on('change', async filePath => {
    const src = path.relative(process.cwd(), filePath);
    const dir = path.dirname(src).replace('cartridges', '');
    const dest = path.join('/', branch(), dir);
    const spinner = ora(`${src} changed, uploading`).start();
    try {
      await mkdirp(dest);
      await write({src, dest});
      spinner.succeed();
    } catch (err) {
      spinner.fail();
      process.stdout.write(chalk.red(`${err}\n`));
      process.exit(1);
    }
  });
};
