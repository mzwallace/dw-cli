const querystring = require('querystring');
const axios = require('axios');

module.exports = async ({clientId, clientPassword}) => {
  try {
    const url = 'https://account.demandware.com/dw/oauth2/access_token';
    const {data} = await axios.post(
      url,
      querystring.stringify({
        grant_type: 'client_credentials' // eslint-disable-line camelcase
      }),
      {
        auth: {
          username: clientId,
          password: clientPassword
        }
      }
    );
    return data.access_token;
  } catch (err) {
    return new Promise((resolve, reject) => reject(new Error(err)));
  }
};
