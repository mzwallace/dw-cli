import got from 'got';

export default async (file, options) => {
  return await got(file, options).text();
};
