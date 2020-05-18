const path = require('path');
const axios = require('axios').default;

module.exports = (file, options) => {
  return axios(
    Object.assign({}, options, {
      url: path.normalize(`/${file}`),
      method: 'DELETE',
    })
  );
};
