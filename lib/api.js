const axios = require('axios').default;
const querystring = require('querystring');
const get = require('lodash/get');

/**
 * @param {Object} options
 * @param {string} options.clientId
 * @param {string} options.clientPassword
 * @param {string} options.endpoint
 * @param {import('axios').Method} options.method
 * @param {string} [options.contentType]
 * @param {any} [options.body]
 */
module.exports = async (options) => {
  try {
    const access_token = await axios({
      url: 'https://account.demandware.com/dw/oauth2/access_token',
      method: 'post',
      data: querystring.stringify({
        grant_type: 'client_credentials', // eslint-disable-line camelcase
      }),
      auth: {
        username: options.clientId,
        password: options.clientPassword,
      },
    }).then(({data}) => data.access_token);

    let headers = {
      common: {
        authorization: `Bearer ${access_token}`,
      },
    };

    if (options.contentType) {
      headers['content-type'] = options.contentType;
    }

    const response = await axios({
      url: options.endpoint,
      method: options.method,
      data: options.body,
      headers,
    });

    return response.data;
  } catch (error) {
    return new Promise((resolve, reject) => {
      if (!error.response) {
        reject(new Error(error));
      } else if (
        error.response.status >= 400 &&
        get(error, 'response.data.fault.message')
      ) {
        reject(new Error(error.response.data.fault.message));
      } else if (get(error, 'response.data.error_description')) {
        reject(new Error(error.response.data.error_description));
      } else {
        reject(new Error(error));
      }
    });
  }
};
