const path = require('path');
const axios = require('axios');

module.exports = (file, dest, options) => {
  return axios(
    Object.assign({}, options, {
      url: path.normalize(`/${file}`),
      method: 'MOVE',
      headers: {
        Destination: (options.baseURL + dest).replace(/([^:]\/)\/+/g, '$1')
      }
    })
  );
};
