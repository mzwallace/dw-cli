const fs = require('fs');
const path = require('path');
const debug = require('debug')('write');
const axios = require('axios');
const followRedirects = require('follow-redirects');

followRedirects.maxBodyLength = 100 * 1024 * 1024;

module.exports = (src, dest, options) => {
  try {
    debug(`Uploading ${src}`);

    const url = path.join('/', dest, path.basename(src));
    const stats = fs.statSync(src);
    const stream = fs.createReadStream(src);

    const config = Object.assign(
      {
        url,
        method: 'put',
        validateStatus: status => status < 400,
        maxRedirects: 0
      },
      {data: stream},
      options
    );

    const request = axios(config).then(() => url);

    if (options.onProgress) {
      let uploaded = 0;

      stream.on('data', function(buffer) {
        const segmentLength = buffer.length;
        uploaded += segmentLength;
        const percent = (uploaded / stats.size * 100).toFixed(2);
        options.onProgress({uploaded, size: stats.size, percent});
      });
    }

    return request;
  } catch (err) {}
};
