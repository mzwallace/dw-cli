const ora = require('ora');
const chalk = require('chalk');
const request = require('request');
const config = require('../lib/config')();
const authenticate = require('../lib/authenticate');

const getVersions = ({token, env}) => {
  return new Promise((resolve, reject) => {
    request.get(`https://${env}${config.hostname}/s/-/dw/data/v16_6/code_versions`, {
      auth: {
        bearer: token
      }
    }, (err, res, body) => {
      if (err) {
        return reject(err);
      }
      if (res.statusCode >= 400) {
        return reject(new Error(res.body));
      }
      resolve(JSON.parse(body));
    });
  });
};

module.exports = function ({env}) {
  const spinner = ora(`Reading codeversions on ${env}`).start();

  authenticate()
    .then(resp => {
      return Promise.resolve(JSON.parse(resp).access_token);
    })
    .then(token => {
      return getVersions({
        env,
        token
      }).then(({data}) => {
        spinner.succeed();
        data.forEach(version => {
          console.log('\n');
          console.log(version);
          console.log('\n');
        });
        process.exit();
      });
    })
    .catch(err => {
      spinner.fail();
      process.stdout.write(chalk.red(`${err}\n`));
      process.exit(1);
    });
};
