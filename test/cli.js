import fs from 'fs';
import path from 'path';
import test from 'ava';
import execa from 'execa';

test.after.always('cleanup', () => {
  try {
    fs.unlinkSync(path.join(__dirname, 'fixtures/dw.json'));
  } catch (e) {

  }
});

test('push', async t => {
  const result = await execa('../lib/cli.js', ['push', 'dev01', '--folder=fixtures', '--branch=dev']);
  t.is(result.stdout, 'Success');
});

test.serial('init', async t => {
  process.chdir(path.join(__dirname, 'fixtures'));
  const result = await execa('../../lib/cli.js', ['init']);
  t.is(result.stdout, 'dw.json created');
  process.chdir(__dirname);
});

test('init exists', async t => {
  const result = await execa('../lib/cli.js', ['init']);
  t.is(result.stdout, 'dw.json already exists');
});
