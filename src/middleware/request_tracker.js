const fs = require('fs');
const path = require('path');

const utils = require(path.join(__dirname, "../tools/utils.js"));

const nginx_log_path = '/var/log/nginx/screenshop.access.log';

module.exports.read = (req, res, next) => {
	utils.test(true)
	.then((data) => {
		console.log(data);
		next();
	})
	/*
	fs.readFile(nginx_log_path, (err, data) => {
		if (err) throw err;

		let records = data.toString().split('\n');
		if (records.length > 0) {
			utils.test(true)
			.then((data) => {
				console.log(data);
				next();
			})
			.catch((error) => {

			/*
			utils.parse_records(records)
			.then((obj) => {
				res.send('hello');
			})
			.catch((error) => {
				console.error(error);
			})
		} else {
			next();
		}
	})
			*/
}
