const axios = require('axios').default;
const querystring = require('querystring');
const get = require('lodash/get');
const log = require('./log');
let retryCount = 0;

/**
 * @param {Object} options
 * @param {string} options.clientId
 * @param {string} options.clientPassword
 * @param {string} options.endpoint
 * @param {import('axios').Method} options.method
 * @param {string} [options.contentType]
 * @param {any} [options.body]
 */
async function apiRequest(options) {
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
    if (!error.response) {
      throw new Error(error);
    }

    const status = error.response.status;

    if (status === 401 && retryCount < 3) {
      retryCount++;
      log.warn(get(error, 'response.data.fault.message', 'Error, retrying'));
      return apiRequest(options);
    }

    if (status >= 400 && get(error, 'response.data.fault.message')) {
      throw new Error(error.response.data.fault.message);
    }

    if (get(error, 'response.data.error_description')) {
      throw new Error(error.response.data.error_description);
    }
  }
}

module.exports = apiRequest;
