#!/usr/bin/env node --harmony

'use strict';

const debug = require('debug')('cli');
const yargs = require('yargs');
const chalk = require('chalk');
const config = require('./config');

const argv = yargs
.usage('Usage: $0 <command> <instance> --options')
.command('init', 'Create a dw.json file')
.command('versions <instance>', 'List code versions on an instance')
.command('activate <instance> [code-version]', `Activate code version on an instance`)
.command('push <instance>', 'Push code version to an instance')
.command('remove <instance>', 'Remove code version from an instance')
.command('watch <instance>', 'Push changes to an instance')
.command('clean <instance>', 'Remove all inactive code versions from an instance')
.command('log <instance>', 'Stream log files from an instance', yargs => {
  yargs
    .option('poll-interval', {alias: 'options.pollInterval', describe: 'Polling interval for log (Seconds)', default: 1})
    .option('number-lines', {alias: 'options.numberLines', describe: 'Number of lines to print on each tail', default: 10})
    .option('level-filter', {alias: 'options.levelFilter', describe: 'Error level to filter by', default: null})
    .option('message-length', {alias: 'options.messageLength', describe: 'Length to truncate a log message', default: null})
    .option('message-filter', {alias: 'options.messageFilter', describe: 'Filter a log message by text', default: null});
})
.example('$0 versions dev01', 'List code versions on the dev01 instance')
.example('$0 activate dev01', `Activate code version on the dev01 instance`)
.example('$0 push dev01', 'Push code version to the dev01 instance')
.example('$0 remove dev01', 'Remove code version from the dev01 instance')
.example('$0 watch dev01', 'Push changes to the dev01 instance')
.example('$0 clean dev01', 'Remove all inactive code versions from the dev01 instance')
.example('$0 log dev01', 'Stream log files from the dev01 instance')
.option('username', {alias: 'u', describe: 'Username for instance'})
.option('password', {alias: 'p', describe: 'Password for instance'})
.option('hostname', {alias: 'h', describe: 'Hostname for instance'})
.option('cartridges', {alias: 'c', describe: 'Path to cartridges'})
.option('code-version', {alias: ['v'], describe: 'Code Version'})
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
