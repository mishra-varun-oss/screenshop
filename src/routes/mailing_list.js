const path = require('path');
const express = require('express');

const db = require(path.join(__dirname, "../tools/db.js"));

const router = express.Router();

router.post('/', (req, res) => {
	const formData = req.body;

	db.query('INSERT INTO mailing_list SET ?', formData, (error, results) => {
		if (error) {
			console.error('Error inserting into MySQL:', error);
			res.status(500).send('Internal Server Error');
		} else {
			console.log('Form data inserted into MySQL:', results);
			res.status(200).send('Form submitted successfully');
		}
	});
})

module.exports = router;
