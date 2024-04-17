const path = require('path');
const fs = require('fs');
const express = require('express');

const db = require(path.join(__dirname, "../tools/db.js"));

const router = express.Router();

router.get('/', (req, res) => {
	res.render('map');
})

router.get('/get_activity', (req, res) => {
	let limit = req.query.limit;
	let last_index = req.query.last_record;
	let q = `SELECT DISTINCT * FROM site_hits` 
	if (last_index) {
		q += ` WHERE id < ${last_index}`;
	}
	q += ` ORDER BY id DESC LIMIT ${limit}`;
	db.query(q, (err, results) => {
		if (err) throw err;
		if (results.length > 0) {
			let obj = {
				success: true, 
				results: results,
				index: results[limit - 1].id
			}
			res.send(obj);
		}
	})
})

module.exports = router;
