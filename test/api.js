import fs from 'fs';
import path from 'path';
import test from 'ava';
import write from '../lib/write';
import mkdir from '../lib/mkdir';
import read from '../lib/read';
import zip from '../lib/zip';

test.after.always('cleanup', () => {
  // cleanup zip test
  fs.unlinkSync(path.join(__dirname, 'fixtures/archive.zip'));
  fs.unlinkSync(path.join(__dirname, 'fixtures/nested.zip'));
});

// test('write', async t => {
//   const data = await write(path.join(__dirname, 'fixtures/testFile'));
//   console.log(data);
//   t.true(true);
// });

// test('read', async t => {
//   const data = await read('cartridges/test');
//   t.true(data.length > 0);
// });

test('zip file', async t => {
  await zip({
    src: './fixtures/testFile',
    dest: './fixtures',
    name: 'archive.zip'
  });
  t.notThrows(() => {
    fs.accessSync(path.join(__dirname, 'fixtures/archive.zip'));
  });
});

test('zip folder', async t => {
  await zip({
    src: './fixtures/nested',
    dest: './fixtures',
    name: 'nested.zip',
    root: './fixtures'
  });
  t.notThrows(() => {
    fs.accessSync(path.join(__dirname, 'fixtures/nested.zip'));
  });
});

// test('mkdir', async t => {
//   const data = await mkdir('test');
//   console.log(data);
//   t.true(data.indexOf('URL Not Found') < 0);
// });
