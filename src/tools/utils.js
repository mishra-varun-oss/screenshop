const path = require('path');
const geoip = require('geoip-lite');

const db = require(path.join(__dirname, "./db.js"));

module.exports.generate_id = () => {
	let length = 7;
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
	const charactersLength = characters.length;
	let counter = 0;
	while (counter < length) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
		counter += 1;
	}
	return result;
}

module.exports.parse_records = (records) => {
	return new Promise((resolve, reject) => {
		let count = 0;
		records.forEach((record) => {
			let record_specs = record.split(';;');
			let [ip_address, time, request_type, request_status, http_referer, http_user_agent] = record_specs;
			let geo = geoip.lookup(ip_address);
			let latitude, longitude;
			latitude = longitude = null;
			if (geo) {
				latitude = geo.ll[0];
				longitude = geo.ll[1];
			}
			let record_data = { ip_address, time, request_type, request_status, http_referer, http_user_agent, latitude, longitude };
			let q = `INSERT INTO site_hits VALUES (default, '${ip_address}', ${longitude}, ${latitude}, '${time}', '${request_type}', '${request_status}', '${http_referer}', '${http_user_agent}')`;
			db.query(q, (err, results) => {
				if (err) {
					console.log(err);
					return reject(err);
				}
				count++;
				if (count == records.length) {
					let obj = { success: true }
					resolve(obj);
				}
			})
		})
	})
}
