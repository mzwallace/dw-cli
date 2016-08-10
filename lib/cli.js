#!/usr/bin/env node

'use strict';

const path = require('path');
const yargs = require('yargs');
const config = require(process.cwd() + '/dw.json');

const requestConfig = {
  baseUrl: 'https://' + config.hostname + '/on/demandware.servlet/webdav/Sites/Cartridges/',
  auth: {
    username: config.username,
    password: config.password
  },
  strictSSL: false
};

exports.requestConfig = requestConfig;

const argv = yargs
.usage('Usage: $0 <command> <env>')
.command('push <env>', 'Push code to an environment')
.command('watch <env>', 'Push file changes to an environment')
.command('activate <env> <codeversion>', 'Activate code on an environment')
.command('rollback <env> <commit>', 'Rollback code on an environment')
.command('init', 'Create a dw.json file')
.demand(1)
.help()
.alias('help', 'h')
.version()
.alias('version', 'v')
.argv;

const command = path.join(__dirname, '../commands', argv._[0]);

require(command)(Object.assign({}, requestConfig, argv));
