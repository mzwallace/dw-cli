const path = require('path');
const axios = require('axios');

module.exports = (file, destination, options) => {
  return axios(
    Object.assign({}, options, {
      url: path.normalize(`/${file}`),
      method: 'MOVE',
      headers: {
        Destination: (options.baseURL + destination).replace(
          /([^:]\/)\/+/g,
          '$1'
        ),
      },
    })
  );
};
