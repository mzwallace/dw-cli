import test from 'ava';
import execa from 'execa';

test('push', async t => {
  const result = await execa('../lib/cli.js', ['push', 'dev01', '--folder=fixtures', '--branch=dev']);
  t.pass(result.stdout === 'Success');
});
