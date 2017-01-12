const {groupBy, sortBy, forEach} = require('lodash');
const chalk = require('chalk');
const log = require('../lib/log');
const read = require('../lib/read');
const find = require('../lib/find');

module.exports = async ({webdav, request, logPollInterval, logMessageLength, logMessageFilter}) => {
  try {
    log.info(`Streaming log files from ${webdav}`);
    let files = await find('Logs', request);

    // only log files
    files = files.filter(file => file.displayname.includes('.log'));

    // group by log type
    const groups = groupBy(files, file => file.displayname.split('-blade')[0]);
    const logs = [];

    // sort files by last modified, setup logs
    forEach(groups, (files, name) => {
      logs[name] = [];
      groups[name] = sortBy(files, file => new Date(file.getlastmodified)).reverse()[0];
    });

    // every 1 second tail from the environment
    setInterval(() => {
      forEach(groups, (file, name) => {
        read(`Logs/${file.displayname}`, request).then(body => {
          const lines = body.split('\n').slice(-10);

          forEach(lines, line => {
            if (line && logs[name].indexOf(line) === -1) {
              logs[name].push(line);
              let message = `${chalk.white(name)} ${line}`;
              if (logMessageLength) {
                message = message.slice(0, logMessageLength * 2);
              }

              if ( ! logMessageFilter || (logMessageFilter && new RegExp(logMessageFilter).test(message))) {
                log.plain(message, 'blue');
              }
            }
          });
        });
      });
    }, logPollInterval * 1000);
  } catch (err) {
    log.error(err);
  }
};
