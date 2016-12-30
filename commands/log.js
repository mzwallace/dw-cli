const fs = require('fs');
const ora = require('ora');
const get = require('lodash').get;
const groupBy = require('lodash').groupBy;
const sortBy = require('lodash').sortBy;
const each = require('lodash').each;
const last = require('lodash').last;
const log = require('../lib/log');
const read = require('../lib/read');
const find = require('../lib/find');
const chalk = require('chalk');

module.exports = async ({codeVersion}) => {
  log.info(`Streaming log files`);
  // const spinner = ora().start();

  try {
    // spinner.text = `Streaming`;
    let files = await find('Logs');

    // only log files
    files = files.filter(file => file.displayname.includes('.log'));

    // group by log type
    let groups = groupBy(files, file => file.displayname.split('-blade')[0]);
    let logs = [];

    // sort files by last modified, setup logs
    each(groups, (files, name) => {
      logs[name] = [];
      groups[name] = sortBy(files, file => new Date(file.getlastmodified)).reverse()[0];
    });

    // every 1 second tail from the environment
    setInterval(function update() {
      each(groups, (file, name) => {
        read(`Logs/${file.displayname}`).then(function(body) {
          let lines = body.split('\n').slice(-10);

          each(lines, line => {
            if (line && logs[name].indexOf(line) === -1) {
              logs[name].push(line);
              let message = `${chalk.white(name)} ${line}`;
              // message = message.slice(0, 150);
              log.plain(message, 'blue');
            }
          })
        });
      });

      return update;
    }(), 1000);
  } catch (err) {
    spinner.fail();
    log.error(err);
  }
};
