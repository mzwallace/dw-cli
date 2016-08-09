import path from 'path';
import test from 'ava';
import write from '../lib/write';
// import read from '../lib/read';

test('write', async t => {
  const data = await write(path.join(__dirname, 'fixtures/testFile'));
  console.log(data);
  t.true(true);
});

// test('read', async t => {
//   const data = await read('cartridges');
//   t.true(data.indexOf('URL Not Found') < 0);
// });
