const path = require('path');
const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, "../../templates/views/bjana_flipbook.html"));
})

module.exports = router;
