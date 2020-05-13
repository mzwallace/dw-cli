#!/usr/bin/env node

'use strict';

const debug = require('debug')('cli');
const path = require('path');
const fs = require('fs');
const https = require('https');
const chalk = require('chalk');
const codeVersion = require('./branch')();

const yargs = require('yargs')
  .env('DW')
  .middleware((argv) => {
    const instance = argv.instances[argv.instance];

    argv.username =
      process.env.DW_USERNAME || instance.username || argv.username;
    argv.password =
      process.env.DW_PASSWORD || instance.password || argv.password;
    argv.hostname =
      process.env.DW_HOSTNAME || instance.hostname || argv.hostname;
    argv.webdav = process.env.DW_WEBDAV || instance.webdav || argv.webdav;
    argv.key = process.env.DW_KEY || instance.key || argv.key;
    argv.cert = process.env.DW_CERT || instance.cert || argv.cert;
    argv.ca = process.env.DW_CA || instance.ca || argv.ca;

    // If webdav isn't provided, fallback to hostname
    argv.webdav = argv.webdav || argv.hostname;

    argv.request = {
      baseURL: `https://${argv.webdav}/on/demandware.servlet/webdav/Sites/`,
      auth: {
        username: argv.username,
        password: argv.password,
      },
      httpsAgent: new https.Agent({
        key: argv.key ? fs.readFileSync(argv.key) : undefined,
        cert: argv.cert ? fs.readFileSync(argv.cert) : undefined,
        ca: argv.ca ? fs.readFileSync(argv.ca) : undefined,
        pfx: argv.p12 ? fs.readFileSync(argv.p12) : undefined,
        passphrase: argv.passphrase ? argv.passphrase : undefined,
      }),
    };
  })
  .usage('Usage: $0 <command> <instance> [options] --switches')
  .command('init', 'Create a dw-cli.json file')
  .command('versions <instance>', 'List code versions on an instance')
  .command(
    'activate <instance> [code-version]',
    'Activate code version on an instance'
  )
  .command(
    'push <instance> [code-version]',
    'Push code version to an instance',
    {
      zip: {
        alias: 'options.zip',
        describe: 'Upload as a zip',
        default: true,
      },
    }
  )
  .command(
    'remove <instance> [code-version]',
    'Remove code version from an instance'
  )
  .command('watch <instance> [code-version]', 'Push changes to an instance', {
    spinner: {
      describe: 'Show the watch spinner',
      type: 'boolean',
      default: true,
    },
    silent: {describe: 'Show notifications', type: 'boolean', default: false},
    remove: {describe: 'Remove deleted files', type: 'boolean'},
  })
  .command('job <instance> <job-id>', 'Run a job on an instance')
  .command('clean <instance>', 'Remove inactive code versions on instance')
  .command('extract <instance> <file>', 'Extract a file on an instance')
  .command('log <instance>', 'Stream log files from an instance', {
    'poll-interval': {
      alias: 'options.pollInterval',
      describe: 'Polling interval for log (seconds)',
      default: 2,
    },
    'num-lines': {
      alias: 'options.numLines',
      describe: 'Number of lines to print on each tail',
      default: 100,
    },
    include: {
      alias: 'options.include',
      describe: 'Log levels to include',
      type: 'array',
      default: [],
    },
    exclude: {
      alias: 'options.exclude',
      describe: 'Log levels to exclude',
      type: 'array',
      default: [],
    },
    list: {
      alias: 'options.list',
      describe: 'Output a list of available log levels',
      default: false,
    },
    filter: {
      alias: 'options.filter',
      describe: 'Filter log messages by regexp',
      default: undefined,
    },
    length: {
      alias: 'options.length',
      describe: 'Length to truncate a log message',
      default: undefined,
    },
    search: {
      alias: 'options.search',
      describe:
        'Instead of a tail, this will execute a search on all log files (useful for Production)',
      default: false,
    },
    'no-timestamp': {
      alias: 'options.noTimestamp',
      describe: 'Stop converting timestamps to computer locale',
      default: false,
    },
  })
  .command(
    'keygen <user> <crt> <key> <srl>',
    'Generate a staging certificate for a stage instance user account'
  )
  .example('$0 versions dev01', 'List code versions on dev01')
  .example('$0 activate dev01', `Activate branch name as code version on dev01`)
  .example('$0 push dev01 version1', 'Push version1 to dev01')
  .example('$0 remove dev01', 'Remove branch name as code version from dev01')
  .example(
    '$0 watch dev01 version1',
    'Push changes in cwd to version1 on dev01'
  )
  .example('$0 clean dev01', 'Remove all inactive code versions on dev01')
  .example('$0 log dev01', 'Stream log files from the dev01')
  .option('username', {describe: 'Username for instance'})
  .option('password', {alias: 'p', describe: 'Password for instance'})
  .option('hostname', {alias: 'h', describe: 'Hostname for instance'})
  .option('cartridges', {alias: 'c', describe: 'Path to cartridges'})
  .option('api-version', {describe: 'Demandware API Version'})
  .option('code-version', {alias: 'v', default: codeVersion})
  .option('client-id', {describe: 'Demandware API Client ID'})
  .option('client-password', {describe: 'Demandware API Client Password'})
  .config({
    extends: path.join(process.cwd(), 'dw-cli.json'),
  })
  .demand(1)
  .help()
  .version();

const argv = yargs.argv;

const command = argv._[0];

try {
  debug(`Executing ${command}`);

  if (command === 'init') {
    require(path.join(__dirname, `../commands/init.js`))();
  } else {
    require(path.join(__dirname, `../commands/${command}.js`))(argv);
  }
} catch (error) {
  if (error.code === 'MODULE_NOT_FOUND') {
    console.log(error.message);
    console.log(chalk.red(`\nThe command '${command}' is not valid.\n`));
    console.log(`Use '${argv.$0} help' for a list of commands.\n`);
  } else {
    throw error;
  }
}
