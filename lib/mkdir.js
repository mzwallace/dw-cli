import got from 'got';

export default async (url, options) => {
  try {
    const response = await got(url, {
      ...options,
      method: 'MKCOL',
      throwHttpErrors: false,
    });
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
