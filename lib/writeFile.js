const {relative, dirname} = require('path');
const exec = require('child_process').exec;
const {username, password, hostname} = require('../dw.json');

module.exports = function writeFile(filePath = '') {
	const relativePath = relative(process.cwd(), filePath);
	const dir = dirname(relativePath);
	const command = `curl -T '${filePath}' -H "Authorization: Basic ${(new Buffer(`${username}:${password}`)).toString('base64')}" "https://${hostname}/on/demandware.servlet/webdav/Sites/Cartridges/${dir}/"`;
	return new Promise(resolve => {
		exec(command, error => {
			if (error) {
				throw new Error(error);
			}
			resolve();
		});
	});
};
