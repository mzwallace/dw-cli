import got from 'got';
import {get} from 'lodash-es';
import log from './log.js';
let retryCount = 0;

/**
 * @param {Object} options
 * @param {string} options.clientId
 * @param {string} options.clientPassword
 * @param {string} options.endpoint
 * @param {'GET'|'POST'|'PATCH'} options.method
 * @param {string} [options.contentType]
 * @param {any?} [options.body]
 */
export default async function apiRequest(options) {
  try {
    const body = await got
      .post('https://account.demandware.com/dw/oauth2/access_token', {
        form: {
          grant_type: 'client_credentials', // eslint-disable-line camelcase
        },
        username: options.clientId,
        password: options.clientPassword,
      })
      .json();

    let headers = {
      Authorization: `Bearer ${body.access_token}`,
    };

    if (options.contentType) {
      headers['Content-Type'] = options.contentType;
    }

    const response = await got(options.endpoint, {
      timeout: {request: 20_000},
      method: options.method,
      json: options.body,
      headers,
    }).json();

    return response.data;
  } catch (error) {
    if (!error.response) {
      throw new Error(error);
    }

    const status = error.response.statusCode;
    const body = JSON.parse(error.response.body);

    if (status === 401 && retryCount < 3) {
      retryCount++;
      log.warn(get(body, 'fault.message', 'Error, retrying'));
      return apiRequest(options);
    }

    if (status >= 400 && get(body, 'fault.message')) {
      throw new Error(body.fault.message);
    }

    if (get(body, 'error_description')) {
      throw new Error(body.error_description);
    }

    console.error(error);
  }
}
