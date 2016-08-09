#!/usr/bin/env node

'use strict';

const yargs = require('yargs');
const config = require(process.cwd() + '/dw.json');

exports.requestConfig = {
  baseUrl: 'https://' + config.hostname + '/on/demandware.servlet/webdav/Sites/Cartridges/',
  auth: {
    username: config.username,
    password: config.password
  },
  strictSSL: false
};

yargs
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

// const options = Object.assign({}, config, yargs.argv)

// require('./lib')(conf, function (err) {
//   if (err) {
//     log.error(err);
//     process.exit(1);
//   }
//   log.info('Done!');
//   process.exit();
// });
