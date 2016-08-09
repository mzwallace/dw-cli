const fs = require('fs');
const path = require('path');
const yazl = require('yazl');

module.exports = dir => {
  const zipfile = new yazl.ZipFile();
  zipfile.outputStream.pipe(fs.createWriteStream('output.zip'));
  zipfile.addFile(path.join(process.cwd(), dir), dir);
  zipfile.end();
};
