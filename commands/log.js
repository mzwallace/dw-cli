const debug = require('debug')('log');
const groupBy = require('lodash/groupBy');
const sortBy = require('lodash/sortBy');
const forEach = require('lodash/forEach');
const pickBy = require('lodash/pickBy');
const map = require('lodash/map');
const truncate = require('lodash/truncate');
const compact = require('lodash/compact');
const ora = require('ora');
const chalk = require('chalk');
const log = require('../lib/log');
const read = require('../lib/read');
const find = require('../lib/find');

module.exports = async ({webdav, request, options}) => {
  const text = `Streaming [Ctrl-C to Cancel]`;
  const spinner = ora(text).start();
  const output = fn => {
    spinner.stop();
    fn();
    spinner.text = text;
    spinner.start();
  };

  try {
    output(() => log.info(`Streaming log files from ${webdav}`));
    let files = await find('Logs', request);

    // only log files
    files = files.filter(({displayname}) => displayname.includes('.log'));

    // group by log type
    let groups = groupBy(
      files,
      ({displayname}) => displayname.split('-blade')[0]
    );

    if (options.levelFilter.length > 0) {
      groups = pickBy(groups, (group, name) =>
        options.levelFilter.includes(name));
    }

    const logs = [];
    // sort files by last modified, setup logs
    forEach(groups, (files, name) => {
      logs[name] = [];
      groups[name] = sortBy(
        files,
        file => new Date(file.getlastmodified)
      ).reverse()[0];
    });

    // every 1 second tail from the environment
    const tail = async () => {
      debug('Doing it');
      const promises = map(groups, async ({displayname}, name) => {
        try {
          const body = await read(`Logs/${displayname}`, request);
          debug(`Read ${displayname}`);
          return {body, name};
        } catch (err) {
          output(() => log.error(err));
        }
      });

      const results = await Promise.all(promises);

      forEach(compact(results), ({body, name}) => {
        const lines = body.split('\n').slice(-options.numberLines);

        forEach(lines, line => {
          if (line && !logs[name].includes(line)) {
            logs[name].push(line);
            if (
              !options.messageFilter ||
              (options.messageFilter &&
                new RegExp(options.messageFilter).test(line))
            ) {
              if (options.messageLength) {
                line = truncate(line.trim(), {
                  length: options.messageLength,
                  omission: ''
                });
              }
              output(() => log.plain(`${chalk.white(name)} ${line}`, 'blue'));
            }
          }
        });
      });

      setTimeout(tail, options.pollInterval * 1000);
    };

    tail();
  } catch (err) {
    output(() => log.error(err));
  }
};
