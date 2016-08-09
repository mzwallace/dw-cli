const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const webdav = require('gulp-webdav-sync');
const zip = require('gulp-zip');
const watch = require('gulp-watch');
const dwdav = require('dwdav');
const git = require('git-rev-sync');
const request = require('request');
const {hostname, username, password} = require('./dw.json');

const wdConfig = {
	protocol: 'https:',
	auth: `${username}:${password}`,
	hostname,
	pathname: `/on/demandware.servlet/webdav/Sites/Cartridges/${git.branch()}/`,
	log: 'info',
	base: 'cartridges'
};

// request({
//   method: 'GET',
//   url: 'https://dev01-us-mzw.demandware.net/on/demandware.servlet/webdav/Sites/Cartridges/',
//   headers: {
//     authorization: `Basic ${(new Buffer(`${username}:${password}`)).toString('base64')}`
//   }
// }, function (error, response, body) {
//   if (error) throw new Error(error);
//
//   console.log(body);
// });

// var options = {
// 	method: 'PUT',
//   url: 'https://dev01-us-mzw.demandware.net/on/demandware.servlet/webdav/Sites/Cartridges/',
//   headers: {
// 		authorization: `Basic ${(new Buffer(`${username}:${password}`)).toString('base64')}`
// 		'content-type': 'multipart/form-data; boundary=---011000010111000001101001'
// 	 },
//   formData:
//    { a_file:
//       { value: fs.createReadStream(path.join(__dirname, 'package.json')),
//         options: { filename: { '0': {} }, contentType: null } } } };
//
// request(options, function (error, response, body) {
//   if (error) throw new Error(error);
//
//   console.log(body);
// });


gulp.task('watch', () => {
	gulp.watch('./cartridges/**').on('change', event => {
		console.log(event.path);
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
