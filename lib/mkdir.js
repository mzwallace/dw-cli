import path from 'node:path';
import axios from 'axios';

export default async (directory, options) => {
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
