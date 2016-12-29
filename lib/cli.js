#!/usr/bin/env node --harmony

'use strict';

const path = require('path');
const fs = require('fs');
const debug = require('debug')('cli');
const yargs = require('yargs');
const chalk = require('chalk');
const _branch = require('./branch');
const convertConfig = require('./config');

function loadConfig(file) {
  let config = {};
  try {
    config = JSON.parse(fs.readFileSync(path.join(process.cwd(), file)));
  } catch (err) {}
  return config;
}

let argv = yargs
.usage('Usage: $ <command>')
.command('push <sandbox>', 'Push all cartridges to an environment')
.example('$ dw push dev01', 'Push all cartridges to the dev01 sandbox')
.example('$ dw push dev01 -c app_core', 'Push a single cartridge to the dev01 sandbox')
.command('watch <sandbox>', 'Push file changes to an environment')
.example('$ dw watch dev01', 'Push changes to the dev01 environment')
.command('versions <sandbox>', 'List codeversions in an environment')
.command('activate <sandbox> <code-version>', 'Activate code on an environment')
.example('$ dw activate dev01 develop')
.command('init', 'Create a dw.json file')
.config(loadConfig('dw.json'))
.options({
  username: {
    alias: 'u',
    describe: 'Sandbox username',
    global: true
  },
  password: {
    alias: 'p',
    describe: 'Sandbox password',
    global: true
  },
  hostname: {
    alias: 'h',
    describe: 'Sandbox hostname',
    global: true
  },
  sandbox: {
    alias: 's',
    describe: 'Sandbox',
    global: true
  },
  'code-version': {
    alias: 'v',
    describe: 'Code version to deploy to',
    default: _branch(),
    global: true
  },
  cartridge: {
    alias: 'c',
    describe: 'Path to single cartridge',
    global: true
  },
  'api-version': {
    describe: 'Demandware API version',
    default: 'v16_6',
    global: true
  },
  'client-id': {
    describe: 'Demandware API client_id',
    global: true
  },
  'client-password': {
    describe: 'Demandware API client_password',
    global: true
  }
})
.demand(1)
.help()
.version()
.argv;

argv = convertConfig(argv);

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
