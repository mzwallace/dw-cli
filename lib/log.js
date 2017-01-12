const chalk = require('chalk');

const time = new Date();

function makePrefix(str) {
  const date = new Date().toLocaleTimeString('en-US', {hour12: false});
  return chalk.reset(`[${date}] ${str}`);
}

function makeSuffix(str) {
  const date = (new Date() - time) / 1000;
  return chalk.reset(`${str} ${date}s`);
}

module.exports = {
  plain(msg, color) {
    if (color) {
      msg = chalk[color](msg);
    }
    console.log(msg);
  },
  info(msg) {
    console.log(makePrefix(chalk.blue(msg)));
  },
  success(msg) {
    console.log(makePrefix(makeSuffix(chalk.green(msg))));
  },
  error(msg) {
    console.log(makePrefix(makeSuffix(chalk.red(msg))));
  }
};
