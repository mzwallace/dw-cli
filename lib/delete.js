import path from 'node:path';
import got from 'got';

export default (file, options) => {
  return got.delete(path.normalize(file), {
    ...options,
    throwHttpErrors: false,
  });
};
