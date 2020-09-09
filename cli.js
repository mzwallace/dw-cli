#!/usr/bin/env node

'use strict';

const yargs = require('yargs');

yargs.commandDir('cli').demandCommand().argv;

// require('dotenv').config();
// const yargs = require('yargs');
// const debug = require('debug')('cli');
// const path = require('path');
// const fs = require('fs');
// const https = require('https');
// const chalk = require('chalk');
// const _ = require('lodash');
// const codeVersion = require('./lib/branch')();

// const jsonPath = path.join(process.cwd(), 'dw-cli.json');

// const sharedOptionsWebdav = {
//   'code-version': {alias: 'v', default: codeVersion},
//   cartridges: {alias: 'c', describe: 'Path to cartridges', default: 'catridges'},
//   username: {describe: 'Username for instance', demandOption: true},
//   password: {alias: 'p', describe: 'Password for instance', demandOption: true},
//   key: {describe: '2FA key file location'},
//   cert: {describe: '2FA cert file location'},
//   ca: {describe: '2FA ca file location'},
//   p12: {describe: '2FA p12 file location'},
//   passphrase: {describe: '2FA p12 passphrase'}
// };
//
// const sharedOptionsApi = {
//   'client-id': {describe: 'Demandware API Client ID', demandOption: true},
//   'client-password': {describe: 'Demandware API Client Password', demandOption: true},
//   hostname: {alias: 'h', describe: 'Hostname for instance', demandOption: true},
//   'api-version': {describe: 'Demandware API Version', demandOption: true}
// };
//
// const argv = yargs
//   .config({extends: fs.existsSync(jsonPath) ? jsonPath : {}})
//   .env('DW')
//   .middleware(configure)
//   .usage('Usage: $0 <command> <instance> [options] --switches')
//   .command('init', 'Create a dw-cli.json file')
//   .command('versions <instance>', 'List code versions on an instance', sharedOptionsApi)
//   .command(
//     'activate <instance> [code-version]',
//     'Activate code version on an instance',
//     sharedOptionsApi
//   )
//   .command(
//     'push <instance> [code-version]',
//     'Push code version to an instance',
//     {
//       ...sharedOptionsWebdav,
//       zip: {
//         alias: 'options.zip',
//         describe: 'Upload as a zip',
//         default: true,
//       },
//     }
//   )
//   .command(
//     'remove <instance> [code-version]',
//     'Remove code version from an instance',
//     sharedOptionsWebdav
//   )
//   .command('watch <instance> [code-version]', 'Push changes to an instance', {
//     ...sharedOptionsWebdav,
//     spinner: {
//       describe: 'Show the watch spinner',
//       type: 'boolean',
//       default: true,
//     },
//     silent: {describe: 'Show notifications', type: 'boolean', default: false},
//     remove: {describe: 'Remove deleted files', type: 'boolean'},
//   })
//   .command('job <instance> <job-id>', 'Run a job on an instance')
//   .command('clean <instance>', 'Remove inactive code versions on instance')
//   .command('extract <instance> <file>', 'Extract a file on an instance')
//   .command('log <instance>', 'Stream log files from an instance', {
//     ...sharedOptionsWebdav,
//     'poll-interval': {
//       alias: 'options.pollInterval',
//       describe: 'Polling interval for log (seconds)',
//       default: 2,
//     },
//     'num-lines': {
//       alias: 'options.numLines',
//       describe: 'Number of lines to print on each tail',
//       default: 100,
//     },
//     include: {
//       alias: 'options.include',
//       describe: 'Log levels to include',
//       type: 'array',
//       default: [],
//     },
//     exclude: {
//       alias: 'options.exclude',
//       describe: 'Log levels to exclude',
//       type: 'array',
//       default: [],
//     },
//     list: {
//       alias: 'options.list',
//       describe: 'Output a list of available log levels',
//       type: 'boolean',
//       default: false,
//     },
//     filter: {
//       alias: 'options.filter',
//       describe: 'Filter log messages by regexp',
//       default: undefined,
//     },
//     length: {
//       alias: 'options.length',
//       describe: 'Length to truncate a log message',
//       default: undefined,
//     },
//     search: {
//       alias: 'options.search',
//       describe:
//         'Instead of a tail, this will execute a search on all log files (useful for Production)',
//       type: 'boolean',
//       default: false,
//     },
//     timestamp: {
//       alias: 'options.timestamp',
//       describe: 'Convert timestamps to your computer locale',
//       type: 'boolean',
//       default: false,
//     },
//   })
//   .command(
//     'keygen <user> <crt> <key> <srl>',
//     'Generate a staging certificate for a stage instance user account', {
//       days: {
//         alias: 'options.days',
//         describe: 'Number of days until the certificate expires',
//         default: 365,
//       }
//     }
//   )
//   .example('$0 versions dev01', 'List code versions on dev01')
//   .example('$0 activate dev01', `Activate branch name as code version on dev01`)
//   .example('$0 push dev01 version1', 'Push version1 to dev01')
//   .example('$0 remove dev01', 'Remove branch name as code version from dev01')
//   .example(
//     '$0 watch dev01 version1',
//     'Push changes in cwd to version1 on dev01'
//   )
//   .example('$0 clean dev01', 'Remove all inactive code versions on dev01')
//   .example('$0 log dev01', 'Stream log files from the dev01')
//   .demand(1)
//   .argv;

// try {
//   debug(`Executing ${command}`);
//
//   if (command === 'init') {
//     require(path.join(__dirname, `commands/init.js`))();
//   } else {
//     require(path.join(__dirname, `commands/${command}.js`))(argv);
//   }
// } catch (error) {
//   if (error.code === 'MODULE_NOT_FOUND') {
//     console.log(error.message);
//     console.log(chalk.red(`\nThe command '${command}' is not valid.\n`));
//     console.log(`Use '${argv.$0} help' for a list of commands.\n`);
//   } else {
//     throw error;
//   }
// }

// /**
//  * Configure argv and fallback options
//  *
//  * @type {import('yargs').MiddlewareFunction}
//  */
// function configure(argv) {
//   const instance = argv.instances && typeof argv.instances[String(argv.instance)] !== 'undefined' ? argv.instances[String(argv.instance)] : {};
//
//   // Required for API commands (versions, job)
//   [
//     'username', 'password', 'hostname',
//     'apiVersion', 'clientId', 'clientPassword',
//     'webdav', 'key', 'cert', 'ca', 'pfx', 'passphrase'
//   ].forEach(function(key) {
//     var processKey =  'DW_' + _.snakeCase(key).toUpperCase();
//     argv[key] = process.env[processKey] || instance[key] || argv[key];
//   });
//
//   // fallback to hostname if webdav is empty
//   argv.webdav = argv.webdav || argv.hostname;
//
//   argv.request = {
//     baseURL: `https://${argv.webdav}/on/demandware.servlet/webdav/Sites/`,
//     auth: {
//       username: argv.username,
//       password: argv.password,
//     },
//     httpsAgent: new https.Agent({
//       key: argv.key ? fs.readFileSync(String(argv.key)) : undefined,
//       cert: argv.cert ? fs.readFileSync(String(argv.cert)) : undefined,
//       ca: argv.ca ? fs.readFileSync(String(argv.ca)) : undefined,
//       pfx: argv.p12 ? fs.readFileSync(String(argv.p12)) : undefined,
//       passphrase: argv.passphrase ? String(argv.passphrase) : undefined,
//     }),
//   };
// }
