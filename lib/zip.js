import fs from 'fs-extra';
import path from 'node:path';
import debug from 'debug';
import archiver from 'archiver';

debug('zip');

export default (source, destination) => {
  return new Promise((resolve) => {
    const archive = archiver('zip', {
      zlib: { level: 9 },
    });
    const file = path.resolve(process.cwd(), destination, 'archive.zip');
    const output = fs.createWriteStream(file);
    const stats = fs.lstatSync(source);
    let fullSource = source;

    debug(`Zipping ${source} to ${file}`);

    if (!path.isAbsolute(source)) {
      fullSource = path.join(process.cwd(), source);
    }

    output.on('close', () => {
      resolve(file);
    });

    archive.on('error', (error) => {
      throw error;
    });

    archive.pipe(output);

    if (stats.isDirectory()) {
      archive.glob('**/*', {
        cwd: fullSource,
        ignore: [
          '**/node_modules/**',
          '**/*.dw.json',
          '**/*.dw-cli.json',
          '**/dw.json',
          '**/dw-cli.json',
          '**/jsconfig.json',
        ],
      });
    } else {
      archive.append(fs.createReadStream(fullSource), { name: source });
    }

    archive.finalize();
  });
};
