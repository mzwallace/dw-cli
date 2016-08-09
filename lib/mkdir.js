const exec = require('child_process').exec;
const {username, password, hostname} = require('../dw.json');

module.exports = function mkdir(dir = '') {
	const command = `curl -H "Authorization: Basic ${(new Buffer(`${username}:${password}`)).toString('base64')}" -X MKCOL "https://${hostname}/on/demandware.servlet/webdav/Sites/Cartridges/${dir}"`;
	return new Promise(resolve => {
		exec(command, error => {
			if (error) {
				throw new Error(error);
			}
			resolve();
		});
	});
};
