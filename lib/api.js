const axios = require('axios');
const get = require('lodash/get');
const authenticate = require('../lib/authenticate');

module.exports = async ({
  clientId,
  clientPassword,
  method,
  contentType,
  endpoint,
  body,
}) => {
  try {
    const token = await authenticate({clientId, clientPassword});

    let headers = {
      common: {
        authorization: `Bearer ${token}`,
      },
    };

    if (contentType) {
      headers['content-type'] = contentType;
    }

    const {data} = await axios({
      url: endpoint,
      method,
      data: body,
      headers,
    });

    return data;
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
