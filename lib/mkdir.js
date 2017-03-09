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
    return new Promise((resolve, reject) => {
      if (!err.response) {
        reject(new Error(err));
      } else if (err.response.status === 405) {
        resolve();
      } else {
        reject(new Error(err.response.statusText));
      }
    });
  }
};
