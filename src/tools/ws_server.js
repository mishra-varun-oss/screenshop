const fs = require('fs');
const path = require('path');

const db = require(path.join(__dirname, "./db.js"));
const utils = require(path.join(__dirname, "./utils.js"));

const client_list = new Map();

const nginx_log_path = '/var/log/nginx/screenshop.access.log';

module.exports.handler = (socket) => {
	socket.on('error', console.error);
	let id = utils.generate_id();
	client_list.set(id, socket);

	let connection_obj = { 
		type: 'connect',
		id: id,
		message: 'Hello from server :)'
	}
	socket.send(JSON.stringify(connection_obj));

	socket.on('message', (data) => {
		let message = data.toString();
		let message_obj = JSON.parse(message);

		if (message_obj.type == 'request_map_data') {

		} else if (message_obj.type == 'parse_log') {
			let response_obj = {};
			fs.readFile(nginx_log_path, (err, data) => {
				if (err) throw err;

				let records = data.toString().split('\n');
				if (records.length > 1) {
					utils.parse_records(records)
					.then((obj) => {
						if (obj.success) {
							fs.writeFile(nginx_log_path, '', (err) => {
								if (err) {
									response_obj.type = 'parse_log';
									response_obj.success = false;
								} else {
									response_obj.type = 'parse_log';
									response_obj.success = true;
									response_obj.updated = true;
								}
								socket.send(JSON.stringify(response_obj));
							})
						} else {
							response_obj.type = 'parse_log';
							response_obj.success = false;
							socket.send(JSON.stringify(response_obj));
						}
					})
					.catch((error) => {
						console.error(error);
						response_obj.type = 'parse_log';
						response_obj.success = false;
						socket.send(JSON.stringify(response_obj));
					})
				} else {
					response_obj.type = 'parse_log';
					response_obj.success = true;
					socket.send(JSON.stringify(response_obj));
				}
			})
		}
	})

	socket.on('close', () => {
		client_list.delete(id);
		console.log(`${id} has disconnected :(!`);
	})
}
