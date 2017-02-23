const axios = require('axios');

module.exports = async (file, options) => {
  const {data} = await axios(Object.assign({}, options, {
    url: `/${file}`,
    method: 'GET'
  }));

  return data;
};
