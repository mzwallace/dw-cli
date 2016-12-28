const ora = require('ora');
const chalk = require('chalk');
const request = require('request');
const authenticate = require('../lib/authenticate');
const log = require('../lib/log');

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

module.exports = async (argv, info = false) => {
  const {hostname, apiVersion} = argv;
  if (info) log.info(`Listing codeversions on ${hostname}`);
  const spinner = ora().start();

  try {
    const resp = await authenticate(argv);
    const token = JSON.parse(resp).access_token;

    spinner.text = 'Reading';
    const {data} = await getVersions({hostname, token, apiVersion});
    spinner.stop();

    data.forEach(version => {
      spinner.start();
      spinner.text = version.id;
      version.active ? spinner.succeed() : spinner.fail();
    });
  } catch (err) {
    spinner.fail();
    log.error(err);
  }
};
