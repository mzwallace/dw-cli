import debug from 'debug';
import path from 'node:path';
import querystring from 'node:querystring';
import axios from 'axios';

debug('unzip');

export default (file, options) => {
  const url = path.join('/', file);

  debug(`Unzipping ${url}`);

  return axios.post(
    url,
    querystring.stringify({method: 'UNZIP'}),
    Object.assign({}, options, {
      validateStatus: (status) => status < 400,
    })
  );
};
