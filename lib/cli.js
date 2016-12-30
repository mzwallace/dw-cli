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
.usage('Usage: $ <command>')

.command('activate <sandbox> <code-version>', 'Activate code on an environment')
.example('$ dw activate dev01 develop')

.command('init', 'Create a dw.json file')

.command('log <sandbox>', 'Stream log files from an environment')

.command('push <sandbox>', 'Push all cartridges to an environment')
.example('$ dw push dev01', 'Push all cartridges to the dev01 sandbox')
.example('$ dw push dev01 -c app_core', 'Push a single cartridge to the dev01 sandbox')

.command('versions <sandbox>', 'List codeversions in an environment')

.command('watch <sandbox>', 'Push file changes to an environment')
.example('$ dw watch dev01', 'Push changes to the dev01 environment')

.options({
  username: {
    alias: 'u',
    describe: 'Username for environment',
    global: true
  },
  password: {
    alias: 'p',
    describe: 'Password for environment',
    global: true
  },
  hostname: {
    alias: 'h',
    describe: 'Hostname for environment',
    global: true
  },
  codeVersion: {
    alias: ['v', 'code-version'],
    describe: 'Code version to deploy to',
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
