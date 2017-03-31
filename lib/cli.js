#!/usr/bin/env node --harmony

'use strict';

const debug = require('debug')('cli');
const yargs = require('yargs');
const chalk = require('chalk');
const config = require('./config');

const argv = yargs
.usage('Usage: $0 <command> <instance> [options] --switches')
.command('init', 'Create a dw.json file')
.command('versions <instance>', 'List code versions on an instance')
.command('activate <instance> [code-version]', `Activate code version on an instance`)
.command('push <instance> [code-version]', 'Push code version to an instance')
.command('remove <instance> [code-version]', 'Remove code version from an instance')
.command('watch <instance> [code-version]', 'Push changes to an instance', {
  spinner: {describe: 'Show the watch spinner', default: true}
})
.command('clean <instance>', 'Remove inactive code versions on instance')
.command('extract <instance> <file>', 'Extract a file on an instance')
.command('log <instance>', 'Stream log files from an instance', {
  'poll-interval': {alias: 'options.pollInterval', describe: 'Polling interval for log (seconds)', default: 2},
  'num-lines': {alias: 'options.numLines', describe: 'Number of lines to print on each tail', default: 100},
  include: {alias: 'options.include', describe: 'Log levels to include', type: 'array', default: []},
  exclude: {alias: 'options.exclude', describe: 'Log levels to exclude', type: 'array', default: []},
  list: {alias: 'options.list', describe: 'Output a list of available log levels', default: false},
  filter: {alias: 'options.filter', describe: 'Filter log messages by regexp', default: null},
  length: {alias: 'options.length', describe: 'Length to truncate a log message', default: null},
  search: {alias: 'options.search', describe: 'Instead of a tail, this will execute a search on all log files', default: false},
  'no-timestamp': {alias: 'options.noTimestamp', describe: 'Stop converting timestamps to computer locale', default: false}
})
.command('keygen <user> <crt> <key> <srl>', 'Generate a staging certificate for a stage instance user account')
.example('$0 versions dev01', 'List code versions on dev01')
.example('$0 activate dev01', `Activate branch name as code version on dev01`)
.example('$0 push dev01 version1', 'Push version1 to dev01')
.example('$0 remove dev01', 'Remove branch name as code version from dev01')
.example('$0 watch dev01 version1', 'Push changes in cwd to version1 on dev01')
.example('$0 clean dev01', 'Remove all inactive code versions on dev01')
.example('$0 log dev01', 'Stream log files from the dev01')
.option('username', {alias: 'u', describe: 'Username for instance'})
.option('password', {alias: 'p', describe: 'Password for instance'})
.option('hostname', {alias: 'h', describe: 'Hostname for instance'})
.option('cartridges', {alias: 'c', describe: 'Path to cartridges'})
.option('api-version', {describe: 'Demandware API Version'})
.option('client-id', {describe: 'Demandware API Client ID'})
.option('client-password', {describe: 'Demandware API Client Password'})
.demand(1)
.help()
.version()
.argv;

const command = argv._[0];
const file = `../commands/${command}.js`;

try {
  debug(`Executing ${command}`);
  require(file)(config(argv));
} catch (err) {
  if (err.code === 'MODULE_NOT_FOUND') {
    console.log(chalk.red(`\nThe command '${command}' is not valid.\n`));
    console.log(`Use '${argv.$0} help' for a list of commands.\n`);
  } else {
    throw err;
  }
}
