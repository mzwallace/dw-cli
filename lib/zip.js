const fs = require('fs');
const path = require('path');
const debug = require('debug')('zip');
const archiver = require('archiver');

module.exports = opts => {
  const options = Object.assign({
    src: '',
    dest: ''
  }, opts);

  return new Promise(resolve => {
    const archive = archiver('zip');
    const outFile = path.resolve(process.cwd(), options.dest, 'archive.zip');
    const output = fs.createWriteStream(outFile);
    const stats = fs.lstatSync(options.src);
    let fullSrc = options.src;

    debug(`Zipping ${options.src} to ${outFile}`);

    if (!path.isAbsolute(options.src)) {
      fullSrc = path.join(process.cwd(), options.src);
    }

    output.on('close', () => {
      resolve(outFile);
    });

    archive.on('error', error => {
      throw error;
    });

    archive.pipe(output);

    if (stats.isDirectory()) {
      archive.directory(fullSrc, path.basename(fullSrc));
    } else {
      const file = fs.createReadStream(fullSrc);
      archive.append(file, {name: options.src});
    }

    archive.finalize();
  });
};
