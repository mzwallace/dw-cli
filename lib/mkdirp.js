import path from 'node:path';
import mkdir from './mkdir.js';

export default async (directory, options) => {
  const folders = path
    .normalize(directory)
    .split('/')
    .filter((folder) => folder.length);

  let index = 0;
  for (const folder of folders) {
    await mkdir(
      index > 0 ? folders.slice(0, index + 1).join('/') : folder,
      options
    );
    index++;
  }
};
