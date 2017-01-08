const fs = require('fs');
const path = require('path');
const debug = require('debug')('zip');
const archiver = require('archiver');

module.exports = (src, dest) => {
  return new Promise(resolve => {
    const archive = archiver('zip');
    const file = path.resolve(process.cwd(), dest, 'archive.zip');
    const output = fs.createWriteStream(file);
    const stats = fs.lstatSync(src);
    let fullSrc = src;

    debug(`Zipping ${src} to ${file}`);

    if (!path.isAbsolute(src)) {
      fullSrc = path.join(process.cwd(), src);
    }

    output.on('close', () => {
      resolve(file);
    });

    archive.on('error', error => {
      throw error;
    });

    archive.pipe(output);

    if (stats.isDirectory()) {
      archive.glob('**/*', {
        cwd: fullSrc,
        ignore: ['**/node_modules/**', '**/*.dw.json']
      });
    } else {
      archive.append(fs.createReadStream(fullSrc), {name: src});
    }

    archive.finalize();
  });
};
