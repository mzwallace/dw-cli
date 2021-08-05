import debug from 'debug';
import path from 'node:path';
import got from 'got';

debug('unzip');

export default (file, options) => {
  const url = path.join(file);

  debug(`Unzipping ${url}`);

  return got.post(url, {
    ...options,
    throwHttpErrors: false,
    searchParams: {method: 'UNZIP'},
  });
};
