const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const webdav = require('gulp-webdav-sync');
const zip = require('gulp-zip');
const watch = require('gulp-watch');
const dwdav = require('dwdav');
const git = require('git-rev-sync');
const https = require('https');
const request = require('request');
const exec = require('child_process').exec;
const {hostname, username, password} = require('./dw.json');

const wdConfig = {
  protocol: 'https:',
  auth: `${username}:${password}`,
  hostname,
  pathname: `/on/demandware.servlet/webdav/Sites/Cartridges/${git.branch()}/`,
  log: 'info',
  base: 'cartridges'
};

function mkdir(dir = '') {
  const command = `curl -H "Authorization: Basic ${(new Buffer(`${username}:${password}`)).toString('base64')}" -X MKCOL "https://${hostname}/on/demandware.servlet/webdav/Sites/Cartridges/${dir}"`;
  return new Promise(resolve => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        throw new Error(error);
      }
      resolve();
    });
  });
}

function mkdirp(dir = '') {
  let p = Promise.resolve();
  const folders = path.normalize(dir).split('/');
  folders.forEach((folder, i) => {
    let toMake = folders[i];
    if (i > 0) {
      toMake = folders.slice(0, i + 1).join('/');
    }
    p = p.then(() => mkdir(toMake))
  });
  return p;
}

function writeFile(filePath = '') {
  const relativePath = path.relative(__dirname, filePath);
  const dir = path.dirname(relativePath);
  const command = `curl -T '${filePath}' -H "Authorization: Basic ${(new Buffer(`${username}:${password}`)).toString('base64')}" "https://${hostname}/on/demandware.servlet/webdav/Sites/Cartridges/${dir}/"`;
  return new Promise(resolve => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        throw new Error(error);
      }
      resolve();
    });
  });
}

gulp.task('t', () => {
  return mkdirp('hi/there/david');
});

gulp.task('watch', () => {
  watch('cartridges/**').on('change', (filePath) => {
    const dir = path.dirname(path.relative(__dirname, filePath));
    writeFile(filePath)
      .catch(mkdirp(dir))
      .then(writeFile(filePath));
  });
});

gulp.task('zip', () => {
  return gulp.src('cartridges/**')
    .pipe(zip('archive.zip'))
    .pipe(gulp.dest('tmp'));
});

gulp.task('deploy', ['zip'], () => {
  return dwdav({
    hostname,
    username,
    password,
    version: git.branch(),
    root: 'tmp'
  }).postAndUnzip('tmp/archive.zip');
});
