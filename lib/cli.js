#!/usr/bin/env node --harmony

'use strict';

const path = require('path');
const fs = require('fs');
const debug = require('debug')('cli');
const yargs = require('yargs');
const chalk = require('chalk');
const _branch = require('./branch');
const config = require('./config');

let argv = yargs
.usage('Usage: $0 <command> [args] --option')

.command('init', 'Create a dw.json file')

.command('versions <instance>', 'List code versions on an instance')
.example('$ dw versions dev01', 'List code versions on the dev01 instance')

.command('activate <instance> <code-version>', 'Activate code version on an instance')
.example('$ dw activate dev01 version1', 'Activate version1 on the dev01 instance')

.command('push <instance>', 'Push all cartridges to an instance')
.example('$ dw push dev01', 'Push all cartridges to the dev01 instance')
.example('$ dw push dev01 -c app_core', 'Push a single cartridge to the dev01 instance')

.command('watch <instance>', 'Push changes to an instance')
.example('$ dw watch dev01', 'Push changes to the dev01 instance')
.example('$ dw watch dev01 -c app_core', 'Push cartridge changes to the dev01 instance')

.command('log <instance>', 'Stream log files from an instance')
.example('$ dw log dev01', 'Stream log files from the dev01 instance')

.options({
  username: {
    alias: 'u',
    describe: 'Username for instance',
    global: true
  },
  password: {
    alias: 'p',
    describe: 'Password for instance',
    global: true
  },
  hostname: {
    alias: 'h',
    describe: 'Hostname for instance',
    global: true
  },
  codeVersion: {
    alias: ['v', 'code-version'],
    describe: 'Code version to push',
    default: _branch(),
    global: true
  },
  cartridge: {
    alias: 'c',
    describe: 'Path to single cartridge',
    global: true
  },
  apiVersion: {
    alias: 'api-version',
    describe: 'Demandware API version',
    default: 'v16_6',
    global: true
  },
  clientId: {
    alias: 'client-id',
    describe: 'Demandware API client_id',
    global: true
  },
  clientPassword: {
    alias: 'client-password',
    describe: 'Demandware API client_password',
    global: true
  }
})

.demand(1)
.help()
.version()
.argv;

argv = config(argv);

const command = path.join(__dirname, '../commands', argv._[0]);

try {
  if (!fs.statSync(`${command}.js`).isFile()) {
    throw Error;
  }
} catch (err) {
  // yargs.showHelp();
  console.log(chalk.red(`\nThe command '${argv._[0]}' is not valid.\n`));
  console.log('Use \'dw help\' for a list of commands.\n');
  process.exit(1);
}

global.argv = argv;

debug(`Executing ${command}`);

require(command)(argv);
