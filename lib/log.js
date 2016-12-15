const chalk = require('chalk');

function makePrefix(str) {
  const date = new Date().toLocaleTimeString('en-US', {hour12: false});
  return chalk.reset(`[${date}] ${str}`);
}

module.exports = {
  info(msg) {
    console.log(makePrefix(chalk.blue(msg)));
  },
  success(msg) {
    console.log(makePrefix(chalk.green(msg)));
  },
  error(msg) {
    console.log(makePrefix(chalk.red(msg)));
  }
};
