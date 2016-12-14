const ora = require('ora');
const chalk = require('chalk');
const request = require('request');
const config = require('../lib/config')();
const authenticate = require('../lib/authenticate');
const branch = require('../lib/branch');

const activateVersion = ({token, env, codeversion}) => {
  return new Promise((resolve, reject) => {
    request.patch(`https://${env}${config.hostname}/s/-/dw/data/${config.api_version}/code_versions/${codeversion}`, {
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

module.exports = function ({env, codeversion = branch()}) {
  const spinner = ora(`Activating ${codeversion} on ${env}`).start();

  authenticate()
    .then(resp => {
      return Promise.resolve(JSON.parse(resp).access_token);
    })
    .then(token => {
      return activateVersion({
        env,
        token,
        codeversion
      }).then(() => {
        spinner.succeed();
        process.stdout.write(chalk.green('Success\n'));
        process.exit();
      });
    })
    .catch(err => {
      spinner.fail();
      process.stdout.write(chalk.red(`${err}\n`));
      process.exit(1);
    });
};
