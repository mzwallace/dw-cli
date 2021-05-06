import axios from 'axios';
import path from 'node:path';
import {parseString} from 'xml2js';
import {get, forEach} from 'lodash-es';

export default async (file, options) => {
  try {
    const {data} = await axios(
      Object.assign({}, options, {
        headers: {
          Depth: 1,
        },
        url: path.isAbsolute(file) ? file : `/${file}`,
        method: 'PROPFIND',
      })
    );
    return await new Promise((resolve, reject) => {
      parseString(data, (error, response) => {
        if (error) {
          return reject(error);
        }

        resolve(
          response.multistatus.response.map((file) => {
            const info = get(file, 'propstat.0.prop.0');
            forEach(info, (value, name) => {
              info[name] = get(value, '0');
            });
            return info;
          })
        );
      });
    });
  } catch (error) {
    // console.log(error);
    return new Error(error);
  }
};
