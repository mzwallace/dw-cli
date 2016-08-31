import fs from 'fs';
import path from 'path';
import test from 'ava';
import write from '../../lib/write';
// import mkdir from '../../lib/mkdir';
// import mkdirp from '../../lib/mkdirp';
import read from '../../lib/read';
// import zip from '../../lib/zip';
// import unzip from '../../lib/unzip';
import del from '../../lib/delete';

test.after.always('cleanup', () => {
  // cleanup zip test
  try {
    fs.unlinkSync(path.join(__dirname, 'fixtures/archive.zip'));
    fs.unlinkSync(path.join(__dirname, 'fixtures/nested.zip'));
  } catch (e) {

  }
});

test('delete', async function (t) {
  await write({
    src: 'fixtures/testFile'
  });
  const remote = await read('testFile');
  t.true(remote.length > 0);
  await del('testFile');
  t.throws(read('testFile'));
});

// test('write', async function (t) {
//   const data = await write({
//     src: 'fixtures/testFile'
//   });
//   t.is(data, '/testFile');
// });

// test('read', async function (t) {
//   const data = await read('cartridges/test');
//   t.true(data.length > 0);
// });

// test('zip file', async function (t) {
//   await zip({
//     src: 'fixtures/testFile',
//     dest: 'fixtures/archive.zip'
//   });
//   t.notThrows(() => {
//     fs.accessSync(path.join(__dirname, 'fixtures/archive.zip'));
//   });
// });

// test('zip folder', async function (t) {
//   await zip({
//     src: 'fixtures/nested',
//     dest: 'fixtures/nested.zip',
//     root: 'fixtures'
//   });
//   t.notThrows(() => {
//     fs.accessSync(path.join(__dirname, 'fixtures/nested.zip'));
//   });
// });

// test('mkdir', async function (t) {
//   const data = await mkdir('test');
//   console.log(data);
//   t.true(data.indexOf('URL Not Found') < 0);
// });

// test('mkdirp', async function (t) {
//   const data = await mkdirp('master/nest/folder');
//   console.log(data);
//   t.true(data.indexOf('URL Not Found') < 0);
// });

// test('unzip', async function (t) {
//   t.notThrows(unzip({filePath: 'fixtures/nested.zip'}));
// });
