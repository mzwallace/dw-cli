import path from 'node:path';
import got from 'got';

export default (file, destination, options) => {
  return got(path.normalize(file), {
    ...options,
    method: 'MOVE',
    headers: {
      Destination: (options.baseURL + destination).replace(
        /([^:]\/)\/+/g,
        '$1'
      ),
    },
  });
};
