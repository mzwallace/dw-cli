const chalk = require('chalk');

const time = new Date().getTime();

function makePrefix(string) {
  const date = new Date().toLocaleTimeString('en-US', {hour12: false});
  return chalk.reset(`[${date}] ${string}`);
}

function makeSuffix(string) {
  const date = (new Date().getTime() - time) / 1000;
  return chalk.reset(`${string} ${date}s`);
}

module.exports = {
  plain(message, color) {
    if (color) {
      message = chalk[color](message);
    }
    console.log(message);
  },
  info(message) {
    console.log(makePrefix(chalk.blue(message)));
  },
  success(message) {
    console.log(makePrefix(makeSuffix(chalk.green(message))));
  },
  warn(message) {
    console.log(makePrefix(makeSuffix(chalk.yellow(message))));
  },
  error(message) {
    console.log(makePrefix(makeSuffix(chalk.red(message))));
  },
};
