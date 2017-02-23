const path = require('path');
const querystring = require('querystring');
const debug = require('debug')('unzip');
const axios = require('axios');

module.exports = (file, options) => {
  const url = path.join('/', file);

  debug(`Unzipping ${url}`);

  return axios.post(
    url,
    querystring.stringify({method: 'UNZIP'}),
    Object.assign({}, options, {
      validateStatus: status => status < 400
    })
  );
};
