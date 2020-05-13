const path = require('path');
const axios = require('axios');

module.exports = async (directory, options) => {
  try {
    const url = path.join('/', directory);
    const response = await axios(
      Object.assign({}, options, {
        url,
        method: 'MKCOL',
      })
    );
    return response;
  } catch (error) {
    return new Promise((resolve, reject) => {
      if (!error.response) {
        reject(new Error(error));
      } else if (error.response.status === 405) {
        resolve();
      } else {
        reject(new Error(error.response.statusText));
      }
    });
  }
};
