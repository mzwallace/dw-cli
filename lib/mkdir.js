const path = require('path');
const axios = require('axios');

module.exports = async (dir, options) => {
  try {
    const url = path.join('/', dir);
    const response = await axios(
      Object.assign({}, options, {
        url,
        method: 'MKCOL'
      })
    );
    return response;
  } catch (err) {
    if (err.response.status === 405) {
      return true;
    }
    throw new Error(err.response.statusText);
  }
};
