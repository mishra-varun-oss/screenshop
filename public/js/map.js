const ws = new WebSocket("wss://screenshop.xyz/connect");
let ws_id;
let map;
let index;
let markers = [];

document.querySelector("#update").style.display = "none";

async function initMap() {
	const { Map } = await google.maps.importLibrary("maps");

	map = new Map(document.getElementById("map"), {
		center: { lat: 0, lng: 0 },
		zoom: 1,
	});
}

function set_markers(map) {
	markers.forEach((marker) => {
		marker.setMap(map);
	})
}

function view_next() {
	set_markers(null);
	markers = [];
	request_activity(300, index);
}

function update_map(el) {
	set_markers(null);
	markers = [];
	request_activity(300, '');
	el.style.display = "none";
}

function request_activity(amount, last_index) {
	fetch(`/map/get_activity?limit=${amount}&last_record=${last_index}`)
	.then(response => response.json())
	.then((data) => {
		if (data.success) {
			index = data.index;
			insert_markers(data.results);
		}
	})
}

function insert_markers(results) {
	let coordinates = [];
	results.forEach((result) => {
		if (result.latitude && result.longitude) {
			let position = { lat: result.latitude, lng: result.longitude }
			let info_window_content = 
				`<div class="info_window">
					<p><strong>IP Address:</strong> ${result.ip_address}</p><br>
					<p><strong>User Agent:</strong> ${result.http_user_agent}</p><br>
					<p><strong>Time:</strong> ${result.time}</p><br>
					<p><strong>Request Type:</strong> ${result.request_type}</p><br>
					<p><strong>Referer:</strong> ${result.http_referer}</p><br>
					<p><strong>Request Status:</strong> ${result.request_status}</p><br>
				</div>`;
			let info_window = new google.maps.InfoWindow({
				content: info_window_content
			})

			let marker = new google.maps.Marker({ 
				map: map,
				position: position,
				title: result.ip_address
			})

			marker.addListener('click', () => {
				info_window.open({
					anchor: marker,
					map
				})
			})
			markers.push(marker);
		}
	})
}

function parse_log() {
	let obj = {
		type: 'parse_log',
		id: ws_id
	}
	ws.send(JSON.stringify(obj));
}

initMap();

ws.addEventListener("open", (event) => {
	let obj = {
		type: 'request_map_data',
		status: 'ready'
	}
	ws.send(JSON.stringify(obj));
})

ws.addEventListener("message", (event) => {
	let message = event.data;
	let parsed_message = JSON.parse(message);

	if (parsed_message.type == 'connect') {
		ws_id = parsed_message.id;
		console.log('connected with id: ', ws_id);
		setInterval(parse_log, 5000);
	} else if (parsed_message.type == 'parse_log') {
		if (parsed_message.success) {
			if (parsed_message.updated) {
				console.log('Updated log available!');
				document.querySelector("#update").style.display = "block";	
			}
		} else {
			console.log('Error with server!');
		}
	}
})

window.onload = () => {
	request_activity(300, '');	
}
