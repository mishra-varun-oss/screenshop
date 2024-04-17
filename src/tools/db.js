const mysql = require('mysql');

const connection = mysql.createConnection({ 
	host: '127.0.0.1',
	user: 'shoplifter',
	password: 'Paskca1029SK!!@',
	database: 'screenshop'
})

connection.connect((err) => {
	if (err) {
		console.error('Error:' + err);
		return;
	}

	console.log('Screenshop.xyz is connected to MySQL!');
})

module.exports = connection;

