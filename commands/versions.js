const ora = require('ora');
const chalk = require('chalk');
const request = require('request');
const config = require('../lib/config')();
const authenticate = require('../lib/authenticate');

const getVersions = ({token, env}) => {
  return new Promise((resolve, reject) => {
    request.get(`https://${env}${config.hostname}/s/-/dw/data/${config.api_version}/code_versions`, {
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

module.exports = async function ({env}) {
  const spinner = ora(`Reading codeversions on ${env}`).start();

  try {
    const resp = await authenticate();
    const token = JSON.parse(resp).access_token;
    const {data} = await getVersions({env, token});

    data.forEach(version => {
      console.log('\n');
      console.log(version);
      console.log('\n');
    });
    process.exit();
  } catch (err) {
    spinner.fail();
    process.stdout.write(chalk.red(`${err}\n`));
    process.exit(1);
  }
};
