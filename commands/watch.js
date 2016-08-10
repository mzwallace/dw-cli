const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const git = require('git-rev-sync');
const chokidar = require('chokidar');
const write = require('../lib/write');
const mkdirp = require('../lib/mkdirp');

module.exports = () => {
  const watcher = chokidar.watch('dir', {
    ignored: /[\/\\]\./,
    persistent: true,
    atomic: true
  });

  const folder = path.join(process.cwd(), 'cartridges');

  console.log(chalk.blue(`Watching ${folder} for changes`));

  watcher.add(folder);

  // One-liner for current directory, ignores .dotfiles
  watcher.on('change', filePath => {
    const spinner = ora(`${filePath} changed, uploading`).start();
    const src = path.relative(process.cwd(), filePath);
    const dir = path.dirname(src).replace('cartridges', '');
    const dest = path.join('/', git.branch(), dir);
    mkdirp(dest).then(() => {
      return write({
        src,
        dest
      }).then(() => {
        spinner.succeed();
      });
    });
  });
};
