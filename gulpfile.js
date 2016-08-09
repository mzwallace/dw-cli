const gulp = require('gulp');
const webdav = require('gulp-webdav-sync');
const zip = require('gulp-zip');
const watch = require('gulp-watch');
const dwdav = require('dwdav');
const git = require('git-rev-sync');
const {hostname, username, password} = require('./dw.json');

const wdConfig = {
	protocol: 'https:',
	auth: `${username}:${password}`,
	hostname,
	pathname: `/on/demandware.servlet/webdav/Sites/Cartridges/${git.branch()}/`,
	log: 'info',
	base: 'cartridges'
};

gulp.task('watch', () => {
	// gulp.watch('cartridges/**').on('change', webdav(wdConfig).watch);
	return watch('cartridges/**').pipe(webdav(wdConfig));
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
