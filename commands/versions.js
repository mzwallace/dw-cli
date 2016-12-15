const ora = require('ora');
const chalk = require('chalk');
const request = require('request');
const authenticate = require('../lib/authenticate');

const getVersions = ({token, hostname, apiVersion}) => {
  return new Promise((resolve, reject) => {
    request.get(`https://${hostname}/s/-/dw/data/${apiVersion}/code_versions`, {
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

module.exports = async argv => {
  const {hostname, apiVersion} = argv;
  const spinner = ora(`Reading codeversions on ${hostname}`).start();

  try {
    const resp = await authenticate(argv);
    const token = JSON.parse(resp).access_token;
    const {data} = await getVersions({hostname, token, apiVersion});

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
