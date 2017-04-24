const debug = require('debug')('log');
const groupBy = require('lodash/groupBy');
const sortBy = require('lodash/sortBy');
const forEach = require('lodash/forEach');
const pickBy = require('lodash/pickBy');
const map = require('lodash/map');
const keys = require('lodash/keys');
const truncate = require('lodash/truncate');
const compact = require('lodash/compact');
const ora = require('ora');
const chalk = require('chalk');
const log = require('../lib/log');
const read = require('../lib/read');
const find = require('../lib/find');

module.exports = async ({webdav, request, options}) => {
  const verb = options.search ? 'Searching' : 'Streaming';
  const text = `${verb} log files from ${webdav} [Ctrl-C to Cancel]`;
  const spinner = ora(text);
  const output = fn => {
    spinner.stop();
    fn();
    spinner.text = text;
    spinner.start();
  };

  try {
    // all files
    let files = await find('Logs', request);

    // only log files
    files = files.filter(({displayname}) => displayname.includes('.log'));

    // group by log type
    let groups = groupBy(
      files,
      ({displayname}) => displayname.split('-blade')[0]
    );

    if (options.include.length > 0) {
      groups = pickBy(
        groups,
        (group, name) => {
          return options.include.filter(level => {
            return new RegExp(level).test(name);
          }).length > 0;
        }
      );
    }

    if (options.exclude.length > 0) {
      groups = pickBy(
        groups,
        (group, name) => {
          return options.exclude.filter(level => {
            return new RegExp(level).test(name);
          }).length === 0;
        }
      );
    }

    if (options.list) {
      spinner.stop();
      log.info('Levels:');
      forEach(keys(groups).sort(), group => {
        log.plain(group);
      });

      process.exit();
    }

    // setup logs
    const logs = [];
    forEach(groups, (files, name) => {
      logs[name] = [];
    });

    // sort groups by last modified first
    forEach(groups, (files, name) => {
      groups[name] = sortBy(
        files,
        file => new Date(file.getlastmodified)
      ).reverse();
    });

    debug('yas leave me here');

    const search = async () => {
      const promiseGroups = map(groups, (files, name) => {
        return map(files, async file => {
          const displayname = file.displayname;
          try {
            const response = await read(`Logs/${displayname}`, request);
            return {response, name};
          } catch (err) {
            output(() => log.error(err));
          }
        });
      });

      forEach(promiseGroups, async promises => {
        const results = await Promise.all(promises);

        forEach(compact(results), ({response, name}) => {
          const lines = response.split('\n').slice(-options.numLines);

          forEach(lines, line => {
            if (line) {
              if (options.filter && !new RegExp(options.filter).test(line)) {
                return;
              }
              if (options.length > 0) {
                line = truncate(line.trim(), {
                  length: options.length,
                  omission: ''
                });
              }
              if (!options.noTimestamp) {
                line = line.replace(/\[(.+)\sGMT\]/g, (exp, match) => {
                  const date = new Date(Date.parse(match + 'Z'));
                  return chalk.magenta(`[${date.toLocaleDateString()} ${date.toLocaleTimeString()}]`);
                });
              }
              if (options.filter) {
                line = line.replace(new RegExp(options.filter, 'g'), exp => {
                  return chalk.yellow(exp);
                });
              }
              output(() => log.plain(`${chalk.white(name)} ${line}`, 'blue'));
            }
          });
        });
      });
    };

    // every 1 second tail from the environment
    const tail = async () => {
      const promises = map(groups, async (files, name) => {
        const displayname = files[0].displayname;
        try {
          const response = await read(`Logs/${displayname}`, request);
          return {response, name};
        } catch (err) {
          output(() => log.error(err));
        }
      });

      const results = await Promise.all(promises);

      forEach(compact(results), ({response, name}) => {
        const lines = response.split('\n').slice(-options.numLines);

        forEach(lines, line => {
          if (line && !logs[name].includes(line)) {
            logs[name].push(line);
            if (options.filter && !new RegExp(options.filter).test(line)) {
              return;
            }
            if (options.length > 0) {
              line = truncate(line.trim(), {
                length: options.length,
                omission: ''
              });
            }
            if (!options.noTimestamp) {
              line = line.replace(/\[(.+)\sGMT\]/g, (exp, match) => {
                const date = new Date(Date.parse(match + 'Z'));
                return chalk.magenta(`[${date.toLocaleDateString()} ${date.toLocaleTimeString()}]`);
              });
            }
            if (options.filter) {
              line = line.replace(new RegExp(options.filter, 'g'), exp => {
                return chalk.yellow(exp);
              });
            }
            output(() => log.plain(`${chalk.white(name)} ${line}`, 'blue'));
          }
        });
      });

      setTimeout(tail, options.pollInterval * 1000);
    };

    spinner.start();
    options.search ? search() : tail();
    tail();
  } catch (err) {
    output(() => log.error(err));
  }
};
