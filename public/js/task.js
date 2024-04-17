const input_field = document.querySelector("#name");
const status = document.querySelector("#status");

async function post(url = '', data = {}) {
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	})
	return response.json();
}

function send_message() {
	if (input_field.value.length > 0) {
		post('/task/message', { name: input_field.value })
		.then((data) => {
			console.log(data);
			if (data.success) {
				status.textContent = "Message sent!";
				input_field.value = '';
			}
		})
	} else {
		status.textContent = "Please enter your name."
	}
}
