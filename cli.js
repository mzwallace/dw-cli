#!/usr/bin/env node

import 'dotenv/config';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import debug from 'debug';
import path from 'node:path';
import fs from 'node:fs';
import https from 'node:https';
import codeVersion from './lib/branch.js';
import { commands } from './commands/index.js';
debug('cli');

const jsonPath = path.join(process.cwd(), 'dw-cli.json');

yargs(hideBin(process.argv))
  .env('DW')
  .middleware(configure)
  .usage('Usage: $0 <command> <instance> [options] --switches')
  .command({
    command: 'init',
    describe: 'Create a dw-cli.json file',
    handler: commands.init,
  })
  .command({
    command: 'versions <instance>',
    describe: 'List code versions on an instance',
    handler: commands.versions,
  })
  .command({
    command: 'activate <instance> [code-version]',
    describe: 'Activate code version on an instance',
    handler: commands.activate,
  })
  .command({
    command: 'push <instance> [code-version]',
    describe: 'Push code version to an instance',
    builder: {
      zip: {
        alias: 'options.zip',
        describe:
          'Upload as zip file, use --no-zip to upload as individual files',
        default: true,
      },
    },
    handler: commands.push,
  })
  .command({
    command: 'remove <instance> [code-version]',
    describe: 'Remove code version from an instance',
    handler: commands.remove,
  })
  .command({
    command: 'watch <instance> [code-version]',
    describe: 'Push changes to an instance',
    builder: {
      spinner: {
        alias: 'options.spinner',
        describe: 'Show the watch spinner, use --no-spinner to hide',
        type: 'boolean',
        default: true,
      },
      silent: {
        alias: 'options.silent',
        describe: 'Hide file upload notifications',
        type: 'boolean',
        default: false,
      },
      remove: {
        alias: 'options.remove',
        describe: 'Remove locally deleted files from the remote filesystem',
        type: 'boolean',
        default: false,
      },
    },
    handler: commands.watch,
  })
  .command({
    command: 'job <instance> <job-id>',
    describe: 'Run a job on an instance',
    handler: commands.job,
  })
  .command({
    command: 'clean <instance>',
    describe: 'Remove inactive code versions on instance',
    handler: commands.clean,
  })
  .command({
    command: 'extract <instance> <file>',
    describe: 'Extract a file on an instance',
    handler: commands.extract,
  })
  .command({
    command: 'log <instance>',
    describe: 'Stream log files from an instance',
    builder: {
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
      'include': {
        alias: 'options.include',
        describe: 'Log levels to include',
        type: 'array',
        default: [],
      },
      'exclude': {
        alias: 'options.exclude',
        describe: 'Log levels to exclude',
        type: 'array',
        default: [],
      },
      'list': {
        alias: 'options.list',
        describe: 'Output a list of log types found on the remote filesystem',
        type: 'boolean',
        default: false,
      },
      'filter': {
        alias: 'options.filter',
        describe: 'Filter log messages by regexp',
        default: undefined,
      },
      'length': {
        alias: 'options.length',
        describe: 'Length to truncate a log message',
        default: undefined,
      },
      'search': {
        alias: 'options.search',
        describe:
          'Instead of a tail, this will execute a search on all log files (useful for Production)',
        type: 'boolean',
        default: false,
      },
      'timestamp': {
        alias: 'options.timestamp',
        describe:
          'Convert the timestamp in each log message to your local computer timezone, use --no-timestamp to disable',
        type: 'boolean',
        default: true,
      },
    },
    handler: commands.log,
  })
  .command({
    command: 'keygen <user> <crt> <key> <srl>',
    describe:
      'Generate a staging certificate for a stage instance user account',
    builder: {
      days: {
        alias: 'options.days',
        describe: 'Number of days until the certificate expires',
        default: 365,
      },
    },
    handler: commands.keygen,
  })
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
  .option('username', { describe: 'Username for instance' })
  .option('password', { alias: 'p', describe: 'Password for instance' })
  .option('hostname', { alias: 'h', describe: 'Hostname for instance' })
  .option('cartridges', { alias: 'c', describe: 'Path to cartridges' })
  .option('api-version', { describe: 'Demandware API Version' })
  .option('code-version', { alias: 'v', default: codeVersion() })
  .option('client-id', { describe: 'Demandware API Client ID' })
  .option('client-password', { describe: 'Demandware API Client Password' })
  .config({ extends: fs.existsSync(jsonPath) ? jsonPath : {} })
  .demandCommand(1)
  .help()
  .version().argv;

/**
 * Configure argv and fallback options
 *
 * @type {import('yargs').MiddlewareFunction}
 */
function configure(argv) {
  const instance =
    argv.instances &&
    typeof argv.instances[String(argv.instance)] !== 'undefined'
      ? argv.instances[String(argv.instance)]
      : {};

  // Required for API commands (versions, job)
  argv.username = process.env.DW_USERNAME || instance.username || argv.username;
  argv.password = process.env.DW_PASSWORD || instance.password || argv.password;
  argv.hostname = process.env.DW_HOSTNAME || instance.hostname || argv.hostname;
  argv.apiVersion =
    process.env.DW_API_VERSION || instance.apiVersion || argv.apiVersion;
  argv.clientId =
    process.env.DW_CLIENT_ID || instance.clientId || argv.clientId;
  argv.clientPassword =
    process.env.DW_CLIENT_PASSWORD ||
    instance.clientPassword ||
    argv.clientPassword;

  // Required for WebDAV commands (push, watch, clean)

  argv.webdav =
    process.env.DW_WEBDAV || instance.webdav || argv.webdav || argv.hostname;

  argv.key = process.env.DW_KEY || instance.key || argv.key;

  argv.cert = process.env.DW_CERT || instance.cert || argv.cert;

  argv.ca = process.env.DW_CA || instance.ca || argv.ca;

  argv.p12 = process.env.DW_P12 || instance.p12 || argv.p12;

  argv.passphrase =
    process.env.DW_PASSPHRASE || instance.passphrase || argv.passphrase;

  argv.request = {
    prefixUrl: `https://${argv.webdav}/on/demandware.servlet/webdav/Sites`,
    username: argv.username,
    password: argv.password,
    agent: {
      https: new https.Agent({
        key: argv.key ? fs.readFileSync(String(argv.key)) : undefined,
        cert: argv.cert ? fs.readFileSync(String(argv.cert)) : undefined,
        ca: argv.ca ? fs.readFileSync(String(argv.ca)) : undefined,
        pfx: argv.p12 ? fs.readFileSync(String(argv.p12)) : undefined,
        passphrase: argv.passphrase ? String(argv.passphrase) : undefined,
      }),
    },
  };
}
