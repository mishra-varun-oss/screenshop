const mysql = require('mysql2');

const connection = mysql.createConnection({ 
	host: '127.0.0.1',
	user: 'transportation',
	password: 'transport_password',
	database: 'transportation_management'
})

connection.connect((err) => {
	if (err) {
		console.error('Error:' + err);
		return;
	}

	console.log('Screenshop.xyz is connected to MySQL!');
})

module.exports = connection;

