#!/usr/bin/env node

'use strict';

const path = require('path');
const fs = require('fs');
const debug = require('debug')('cli');
const yargs = require('yargs');
const chalk = require('chalk');
const _branch = require('./branch');

const folder = {
  alias: 'f',
  type: 'string',
  describe: 'Cartridges folder',
  default: 'cartridges'
};

const branch = {
  alias: 'b',
  type: 'string',
  describe: 'Branch/demandware version',
  default: _branch() || 'master'
};

const config = {
  alias: 'c',
  type: 'string',
  describe: 'Use epecific config file',
  default: 'dw.json'
};

const argv = yargs
.usage('Usage: $ <command> <env> [options]')
.command('push <env> [options]', 'Push code to an environment', {folder, branch, config})
.example('$ dw push dev01', 'Push code to the dev01 environment')
.command('watch <env> [options]', 'Push file changes to an environment', {folder, branch, config})
.example('$ dw watch dev01', 'Watch for changes and push files to the dev01 environment')
.command('activate <env> [codeversion]', 'Activate code on an environment')
.command('rollback <env> <commit>', 'Rollback code on an environment')
.command('init', 'Create a dw.json file')
.demand(1)
.help()
.recommendCommands()
.alias('help', 'h')
.version()
.alias('version', 'v')
.argv;

const command = path.join(__dirname, '../commands', argv._[0]);

try {
  if (!fs.statSync(`${command}.js`).isFile()) {
    throw Error;
  }
} catch (e) {
  console.log(chalk.red(`${argv._[0]} is not a valid command`));
  yargs.showHelp();
  return;
}

global.argv = argv;

debug(`Executing ${command}`);

require(command)(argv);
