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
  const text =
    `${verb} log files from ${webdav} ` +
    (verb == 'Searching' && options.filter ? `for '${options.filter}' ` : '') +
    `[Ctrl-C to Cancel]`;
  const spinner = ora(text);
  const output = (fn) => {
    spinner.stop();
    fn();
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
        (group, name) =>
          options.include.filter((level) => {
            return new RegExp(level).test(name);
          }).length > 0
      );
    }

    if (options.exclude.length > 0) {
      groups = pickBy(
        groups,
        (group, name) =>
          options.exclude.filter((level) => {
            return new RegExp(level).test(name);
          }).length === 0
      );
    }

    if (options.list) {
      spinner.stop();
      log.info('Levels:');
      forEach(keys(groups).sort(), (group) => {
        log.plain(group);
      });
      process.exit();
    }

    // setup logs
    const logs = [];
    forEach(groups, (files, name) => {
      logs[name] = [];
    });

    // sort groups by last modified
    forEach(groups, (files, name) => {
      groups[name] = sortBy(
        files,
        (file) => new Date(file.getlastmodified)
      ).reverse();
    });

    debug('yas leave me here');

    const search = async () => {
      const promiseGroups = map(groups, (files, name) => {
        return map(files, async (file) => {
          const displayname = file.displayname;
          try {
            const response = await read(`Logs/${displayname}`, request);
            return {response, name};
          } catch (error) {
            output(() => log.error(error));
          }
        });
      });

      for (const promises of promiseGroups) {
        const results = await Promise.all(promises);

        for (const {response, name} of compact(results)) {
          const lines = response.split('\n').slice(-options.numLines);

          for (let line of lines) {
            if (line) {
              if (options.timestamp) {
                line = line.replace(/\[(.+)\sGMT]/g, (exp, match) => {
                  const date = new Date(Date.parse(match + 'Z'));
                  return chalk.magenta(
                    `[${date.toLocaleDateString()} ${date.toLocaleTimeString()}]`
                  );
                });
              }
              // if there's a filter and it doesn't pass .,., the ignore line
              if (
                options.filter &&
                !new RegExp(options.filter, 'ig').test(line)
              ) {
                continue;
              }
              // highlight the matching parts of the line
              if (options.filter) {
                line = line.replace(new RegExp(options.filter, 'ig'), (exp) => {
                  return chalk.yellow(exp);
                });
              }

              if (options.length > 0) {
                line = truncate(line.trim(), {
                  length: options.length,
                  omission: '',
                });
              }

              output(() => log.plain(`${chalk.white(name)} ${line}`, 'blue'));
            }
          }
        }
      }

      // spinner.stop();
      spinner.text =
        `Search of ${webdav} ` +
        (options.filter ? `for '${options.filter}' ` : '') +
        `complete`;
      spinner.succeed();
      process.exit();
    };

    const tail = async () => {
      const promises = map(groups, async (files, name) => {
        const displayname = files[0].displayname;
        try {
          const response = await read(`Logs/${displayname}`, request);
          return {response, name};
        } catch (error) {
          output(() => log.error(error));
        }
      });

      const results = await Promise.all(promises);

      for (const {response, name} of compact(results)) {
        const lines = response.split('\n').slice(-options.numLines);

        for (let line of lines) {
          if (line && !logs[name].includes(line)) {
            logs[name].push(line);
            if (options.filter && !new RegExp(options.filter).test(line)) {
              continue;
            }
            if (options.length > 0) {
              line = truncate(line.trim(), {
                length: options.length,
                omission: '',
              });
            }
            if (options.timestamp) {
              line = line.replace(/\[(.+)\sGMT]/g, (exp, match) => {
                const date = new Date(Date.parse(match + 'Z'));
                return chalk.magenta(
                  `[${date.toLocaleDateString()} ${date.toLocaleTimeString()}]`
                );
              });
            }
            if (options.filter) {
              line = line.replace(new RegExp(options.filter, 'g'), (exp) => {
                return chalk.yellow(exp);
              });
            }
            output(() => log.plain(`${chalk.white(name)} ${line}`, 'blue'));
          }
        }
      }

      setTimeout(tail, options.pollInterval * 1000);
    };

    spinner.start();
    options.search ? search() : tail();
  } catch (error) {
    output(() => log.error(error));
  }
};
