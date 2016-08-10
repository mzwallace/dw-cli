const path = require('path');
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

  watcher.add(path.join(process.cwd(), 'cartridges'));

  // One-liner for current directory, ignores .dotfiles
  watcher.on('change', filePath => {
    const src = path.relative(process.cwd(), filePath);
    const dir = path.dirname(src).replace('cartridges', '');
    const dest = path.join('/', git.branch(), dir);
    console.log(src);
    console.log(dest);
    mkdirp(dest).then(() => {
      return write({
        src,
        dest
      });
    });
  });
};
