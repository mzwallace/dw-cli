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
    if (err.response.status >= 400 && get(err, 'response.data.fault.message')) {
      throw new Error(err.response.data.fault.message);
    }
    if (get(err, 'response.data.error_description')) {
      throw new Error(err.response.data.error_description);
    }
    throw new Error(err);
  }
};
