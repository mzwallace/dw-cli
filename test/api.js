import test from 'ava';
// import writeFile from '../lib/writeFile';
import read from '../lib/read';

// test('writeFile', async t => {
// 	await writeFile('fixtures/testFile');
// 	t.true(true);
// });

test('read', async t => {
	const data = await read('cartridges');
	t.true(data.indexOf('URL Not Found') < 0);
});
