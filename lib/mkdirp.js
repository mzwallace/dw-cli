import path from 'node:path';
import Bluebird from 'bluebird';
import mkdir from './mkdir.js';

export default (directory, options) => {
  const folders = path
    .normalize(directory)
    .split('/')
    .filter((folder) => folder.length);
  return Bluebird.each(folders, (folder, index) => {
    if (index > 0) {
      folder = folders.slice(0, index + 1).join('/');
    }
    return mkdir(folder, options);
  });
};
