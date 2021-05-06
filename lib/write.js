import fs from 'fs-extra';
import path from 'node:path';
import debug from 'debug';
import axios from 'axios';
import followRedirects from 'follow-redirects';

debug('write');

// @ts-ignore
followRedirects.maxBodyLength = 100 * 1024 * 1024;

export default (source, destination, options) => {
  try {
    debug(`Uploading ${source}`);

    const url = path.join('/', destination, path.basename(source));
    const stats = fs.statSync(source);
    const stream = fs.createReadStream(source);

    const config = Object.assign(
      {
        url,
        method: 'put',
        validateStatus: (status) => status < 400,
        maxRedirects: 0,
      },
      {data: stream},
      options
    );

    const request = axios(config).then(() => url);

    if (options.onProgress) {
      let uploaded = 0;

      stream.on('data', function (buffer) {
        const segmentLength = buffer.length;
        uploaded += segmentLength;
        const percent = ((uploaded / stats.size) * 100).toFixed(2);
        options.onProgress({uploaded, size: stats.size, percent});
      });
    }

    return request;
  } catch {}
};
