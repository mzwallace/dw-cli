import path from 'node:path';
import axios from 'axios';

export default async (file, options) => {
  const {data} = await axios(
    Object.assign({}, options, {
      url: path.isAbsolute(file) ? file : `/${file}`,
      method: 'GET',
    })
  );

  return data;
};
