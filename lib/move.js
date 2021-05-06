import path from 'node:path';
import axios from 'axios';

export default (file, destination, options) => {
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
