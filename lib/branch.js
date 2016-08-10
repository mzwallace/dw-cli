const shell = require('shelljs');

module.exports = () => {
  return shell.exec('git rev-parse --abbrev-ref HEAD', {silent: true}).split('\n').join('');
};
