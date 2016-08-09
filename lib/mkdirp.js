const {normalize} = require('path');
const mkdir = require('./mkdir');

module.exports = function mkdirp(dir = '') {
	let p = Promise.resolve();
	const folders = normalize(dir).split('/');
	folders.forEach((folder, i) => {
		let toMake = folders[i];
		if (i > 0) {
			toMake = folders.slice(0, i + 1).join('/');
		}
		p = p.then(() => mkdir(toMake));
	});
	return p;
};
