// import fs from 'fs';
// import path from 'path';
// import test from 'ava';
// import execa from 'execa';
// import write from '../lib/write';
// import mkdir from '../lib/mkdir';
// import mkdirp from '../lib/mkdirp';
// import read from '../lib/read';
// import zip from '../lib/zip';
// import unzip from '../lib/unzip';

// test.after.always('cleanup', () => {
//   // cleanup zip test
//   fs.unlinkSync(path.join(__dirname, 'fixtures/archive.zip'));
//   fs.unlinkSync(path.join(__dirname, 'fixtures/nested.zip'));
// });

// test('push', async t => {
//   const result = await execa('../lib/cli.js', ['push', 'dev01', '--folder=fixtures']);
//   t.pass(result.stdout === 'Success');
// });

// test('write', async t => {
//   const data = await write({
//     src: 'fixtures/testFile'
//   });
//   t.true(data === '/testFile');
// });

// test('read', async t => {
//   const data = await read('cartridges/test');
//   t.true(data.length > 0);
// });

// test('zip file', async t => {
//   await zip({
//     src: 'fixtures/testFile',
//     dest: 'fixtures/archive.zip'
//   });
//   t.notThrows(() => {
//     fs.accessSync(path.join(__dirname, 'fixtures/archive.zip'));
//   });
// });
//
// test('zip folder', async t => {
//   await zip({
//     src: 'fixtures/nested',
//     dest: 'fixtures/nested.zip',
//     root: 'fixtures'
//   });
//   t.notThrows(() => {
//     fs.accessSync(path.join(__dirname, 'fixtures/nested.zip'));
//   });
// });

// test('mkdir', async t => {
//   const data = await mkdir('test');
//   console.log(data);
//   t.true(data.indexOf('URL Not Found') < 0);
// });

// test('mkdirp', async t => {
//   const data = await mkdirp('master/nest/folder');
//   console.log(data);
//   t.true(data.indexOf('URL Not Found') < 0);
// });

// test('unzip', async t => {
//   t.notThrows(unzip({filePath: 'fixtures/nested.zip'}));
// });
