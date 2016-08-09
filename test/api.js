import path from 'path';
import test from 'ava';
import write from '../lib/write';
import mkdir from '../lib/mkdir';
import read from '../lib/read';
import zip from '../lib/zip';

// test('write', async t => {
//   const data = await write(path.join(__dirname, 'fixtures/testFile'));
//   console.log(data);
//   t.true(true);
// });

// test('read', async t => {
//   const data = await read('cartridges/test');
//   t.true(data.length > 0);
// });

test('zip', async t => {
  await zip('fixtures/testFile');
  t.true(data.length > 0);
});

// test('mkdir', async t => {
//   const data = await mkdir('test');
//   console.log(data);
//   t.true(data.indexOf('URL Not Found') < 0);
// });
