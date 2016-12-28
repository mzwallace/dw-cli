const ora = require('ora');
const chalk = require('chalk');
const request = require('request');
const authenticate = require('../lib/authenticate');
const branch = require('../lib/branch');
const log = require('../lib/log');

const activateVersion = ({hostname, token, codeVersion, apiVersion}) => {
  return new Promise((resolve, reject) => {
    request.patch(`https://${hostname}/s/-/dw/data/${apiVersion}/code_versions/${codeVersion}`, {
      auth: {
        bearer: token
      },
      json: true,
      body: {
        active: true
      }
    }, (err, res, body) => {
      if (err) {
        return reject(err);
      }
      if (res.statusCode >= 400) {
        return reject(res.body.fault.message);
      }
      resolve(body);
    });
  });
};

module.exports = async argv => {
  const {hostname, codeVersion = branch(), apiVersion} = argv;
  log.info(`Activating ${codeVersion} on ${hostname}`);
  const spinner = ora().start();

  try {
    const resp = await authenticate(argv);
    const token = JSON.parse(resp).access_token;
    spinner.text = 'Activating';
    await activateVersion({hostname, token, codeVersion, apiVersion});
    spinner.succeed();
    await require('./versions')(argv, false);
    log.success('Success');
  } catch (err) {
    spinner.fail();
    log.error(err);
  }
};
