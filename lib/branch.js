const {execSync} = require('child_process');
const {dirname} = require('path');

module.exports = () => {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', {
      stdio: ['pipe', 'pipe', 'ignore'],
      encoding: 'utf8'
    })
      .split('\n')
      .join('');
  } catch (exception) {
    return dirname(__dirname);
  }
};
