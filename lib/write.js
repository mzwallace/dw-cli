import fs from 'node:fs';
import path from 'node:path';
import debug from 'debug';
import got from 'got';

debug('write');

export default async (source, destination, requestOptions, writeOptions) => {
  debug(`Uploading ${source}`);

  const url = path.join(destination, path.basename(source));
  const stats = fs.statSync(source);

  await got
    .put(url, {
      body: fs.createReadStream(source),
      ...requestOptions,
    })
    .on('uploadProgress', (progress) => {
      const percent = ((progress.transferred / stats.size) * 100).toFixed(2);
      writeOptions?.onProgress?.({
        transferred: progress.transferred,
        total: stats.size,
        percent,
      });
    });

  return url;
};
