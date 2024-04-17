const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
	let v_token = req.query['hub.verify_token'];
	if (v_token == 'W6CPmZ0mONANaU8iGHKI') {
		let challenge = req.query['hub.challenge'];
		res.send(challenge);
	}
})

router.post('/', (req, res) => {
	let entry_obj = req.body.entry;
	//console.log(entry_obj[0].changes[0].value);
	console.log(JSON.stringify(entry_obj, null, 4));
})

module.exports = router;
