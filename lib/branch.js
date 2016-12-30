const {execSync} = require('child_process');

module.exports = () => {
  return execSync('git rev-parse --abbrev-ref HEAD', {encoding: 'utf8'}).split('\n').join('');
};
