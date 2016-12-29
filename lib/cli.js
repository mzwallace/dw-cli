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
.command('push <sandbox>', 'Push cartridges to an environment (Assunes "cartridges" folder in cwd)')
.example('$ dw push dev01', 'Push all cartridges to the dev01 sandbox')
.example('$ dw push dev01 --cartridge app_mz_core', 'Push a single cartridge to the dev01 sandbox')
.command('watch <sandbox> <cartridge>', 'Push file changes to an environment')
.example('$ dw watch dev01 app_mz_core', 'Watch for changes and push files to the dev01 environment')
.command('versions <sandbox>', 'List codeversions in an environment')
.command('activate <sandbox> <code-version>', 'Activate code on an environment')
.command('init', 'Create a dw.json file')
.config(loadConfig('dw.json'))
.options({
  username: {
    describe: 'Sandbox username',
    global: true
  },
  password: {
    describe: 'Sandbox password',
    global: true
  },
  hostname: {
    describe: 'Sandbox hostname',
    global: true
  },
  sandbox: {
    describe: 'Sandbox',
    global: true
  },
  'code-version': {
    describe: 'Code version to deploy to',
    default: _branch(),
    global: true
  },
  cartridge: {
    describe: 'Path to single cartridge',
    global: true
  },
  cartridges: {
    describe: 'Path to all cartridges',
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
.recommendCommands()
.alias('help', 'h')
.version()
.alias('version', 'v')
.argv;

argv = convertConfig(argv);

// console.log(argv);
// process.exit();

const command = path.join(__dirname, '../commands', argv._[0]);

try {
  if (!fs.statSync(`${command}.js`).isFile()) {
    throw Error;
  }
} catch (err) {
  console.log(chalk.red(`${argv._[0]} is not a valid command`));
  yargs.showHelp();
  process.exit(1);
}

global.argv = argv;

debug(`Executing ${command}`);

require(command)(argv);
