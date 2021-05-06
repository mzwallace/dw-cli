import path from 'node:path';
import axios from 'axios';

export default (file, options) => {
  return axios(
    Object.assign({}, options, {
      url: path.normalize(`/${file}`),
      method: 'DELETE',
    })
  );
};
