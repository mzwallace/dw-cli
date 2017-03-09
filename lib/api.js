const axios = require('axios');
const get = require('lodash/get');
const authenticate = require('../lib/authenticate');

module.exports = async ({clientId, clientPassword, method, endpoint, body}) => {
  try {
    const token = await authenticate({clientId, clientPassword});

    const {data} = await axios({
      url: endpoint,
      method,
      data: body,
      headers: {
        common: {
          authorization: `Bearer ${token}`
        }
      }
    });

    return data;
  } catch (err) {
    return new Promise((resolve, reject) => {
      if (!err.response) {
        reject(new Error(err));
      } else if (err.response.status >= 400 && get(err, 'response.data.fault.message')) {
        reject(new Error(err.response.data.fault.message));
      } else if (get(err, 'response.data.error_description')) {
        reject(new Error(err.response.data.error_description));
      } else {
        reject(new Error(err));
      }
    });
  }
};
