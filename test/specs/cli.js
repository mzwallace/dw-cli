import fs from 'fs';
import path from 'path';
import test from 'ava';
import execa from 'execa';

// let app;
//
// test.beforeEach.cb(t => {
//   app = require('../server')();
//   t.end();
// });
//
// test.afterEach.cb(t => {
//   app.close(t.end);
// });

test.after.always('cleanup', () => {
  try {
    fs.unlinkSync(path.join(__dirname, 'fixtures/dw.json'));
  } catch (e) {

  }
});

test('push', async function (t) {
  const result = await execa('../../lib/cli.js', ['push', 'dev01', '--folder=fixtures', '--branch=dev']);
  t.is(result.stdout, 'Success');
});

test.serial('init', async function (t) {
  process.chdir(path.join(__dirname, 'fixtures'));
  const result = await execa('../../../lib/cli.js', ['init']);
  t.is(result.stdout, 'dw.json created');
  process.chdir(__dirname);
});

test('init exists', async function (t) {
  const result = await execa('../../lib/cli.js', ['init']);
  t.is(result.stdout, 'dw.json already exists');
});
