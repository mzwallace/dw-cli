import got from 'got';
import { parseString } from 'xml2js';
import { get, forEach } from 'lodash-es';
import log from '../lib/log.js';

export default async (file, options) => {
  try {
    const data = await got(file, {
      ...options,
      headers: {
        Depth: 1,
      },
      method: 'PROPFIND',
    }).text();
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
    log.error(error);
  }
};
