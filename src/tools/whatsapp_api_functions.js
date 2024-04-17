const axios = require('axios');

module.exports.text_message = async (data, auth_token) => {
	try {
		let phone_number_id = '218058244728087';
		let url = `https://graph.facebook.com/v19.0/${phone_number_id}/messages`;
		const headers = {
			'Authorization': `Bearer ${auth_token}`,
			'Content-Type': 'application/json'
		}
		const response = await axios.post(url, data, { headers });
		return response;
	} catch(error) {
		throw error;
	}
}
