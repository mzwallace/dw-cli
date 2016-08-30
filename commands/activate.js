const ora = require('ora');
const chalk = require('chalk');
const request = require('request');
const config = require('../lib/config')();
const branch = require('../lib/branch');

const authenticate = () => {
  let req;
  const promise = new Promise((resolve, reject) => {
    req = request.post('https://account.demandware.com/dw/oauth2/access_token', {
      auth: {
        username: config.client_id,
        password: config.client_password
      },
      form: {
        grant_type: 'client_credentials' // eslint-disable-line
      }
    }, (err, res, body) => {
      if (err) {
        return reject(err);
      }
      if (res.statusCode >= 400) {
        return reject(new Error(res.statusMessage));
      }
      resolve(body);
    });
  });
  promise.request = req;
  return promise;
};

// const getVersions = token => {
//   let req;
//   const promise = new Promise((resolve, reject) => {
//     req = request.get('https://dev01-us-mzw.demandware.net/s/-/dw/data/v16_6/code_versions', {
//       auth: {
//         bearer: token
//       }
//     }, (err, res, body) => {
//       if (err) {
//         return reject(err);
//       }
//       if (res.statusCode >= 400) {
//         return reject(new Error(res.body.fault.message));
//       }
//       resolve(JSON.parse(body));
//     });
//   });
//   promise.request = req;
//   return promise;
// };

const activateVersion = ({token, env, codeversion}) => {
  let req;
  const promise = new Promise((resolve, reject) => {
    req = request.patch(`https://${env}${config.hostname}/s/-/dw/data/v16_6/code_versions/${codeversion}`, {
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
  promise.request = req;
  return promise;
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
        process.stdout.write(chalk.green('Success'));
      });
    })
    .catch(err => {
      spinner.fail();
      process.stdout.write(chalk.red(err));
    });
};
