const path = require('path');
const express = require('express');

const whatsapp = require(path.join(__dirname, "../tools/whatsapp_api_functions.js"));

const router = express.Router();

const auth_token = 'EAAFxRXrl5wgBOy2sHno5eONGtU7elcDY6lsk7xSZBVkgDejzvHp8ZCt0T2hZBoYinjjMzHshIZATsHYaGX6aJ7Y19loaI2HyofPLIWveEB26InKAuue1bLD8Ecwc21NCBMLF4qf2AnYpbOXtagyM1o1VR8blzL8ZCUTjX3bsSnCRiqfPT2dIPmR1GrFZCY4Kr62usmTAqV1vQDZAHxvStgZD';

router.get('/', (req, res) => {
	res.render('task');
})

router.post('/message', (req, res) => {
	let name = req.body.name;
	let message_obj = {
		messaging_product: 'whatsapp',
		recipient_type: 'individual',
		to: '+12674673214',
		type: 'text',
		text: {
			preview_url: false,
			body: `${name} says Hi :)`
		}
	}
	whatsapp.text_message(message_obj, auth_token)
	.then((r) => {
		if (r) {
			res.send({ success: true });
		}
	})
	.catch((error) => {
		console.error(error);
	})
})

module.exports = router;
