const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

module.exports = opts => {
  const options = Object.assign({
    src: '',
    dest: '.',
    name: 'archive.zip',
    root: process.cwd()
  }, opts);

  return new Promise(resolve => {
    const archive = archiver('zip');
    const outFile = path.resolve(process.cwd(), options.dest, options.name);
    const output = fs.createWriteStream(outFile);
    const stats = fs.lstatSync(options.src);

    output.on('close', () => {
      resolve(outFile);
    });

    archive.on('error', error => {
      throw error;
    });

    archive.pipe(output);

    let fullSrc = options.src;

    if (!path.isAbsolute(options.src)) {
      fullSrc = path.join(process.cwd(), options.src);
    }

    if (stats.isDirectory()) {
      archive.directory(fullSrc, path.normalize(path.relative(options.root, options.src)));
    } else {
      const file = fs.createReadStream(fullSrc);
      archive.append(file, {name: options.src});
    }

    archive.finalize();
  });
};
