const url = require('url');
const path = require('path');
const http = require('http');
const express = require('express');
const hbs = require('hbs');
const body_parser = require('body-parser');
const ws = require('ws');

const app = express();
const port = 3000;

const public_directory = path.join(__dirname, "../public");
const views_directory = path.join(__dirname, "../templates/views");

const mailing_list = require(path.join(__dirname, "./routes/mailing_list.js"));
//const map = require(path.join(__dirname, "./routes/map.js"));
const whatsapp = require(path.join(__dirname, "./routes/whatsapp.js"));
const task = require(path.join(__dirname, "./routes/task.js"));
const transport = require(path.join(__dirname, "./routes/crud.js"));
const bjana_flipbook = require(path.join(__dirname, "./routes/bjana_flipbook.js"));
const webrtc = require(path.join(__dirname, "./routes/webrtc.js"));

//const ws_server = require(path.join(__dirname, "./tools/ws_server.js"));
const ws_server2 = require(path.join(__dirname, "./tools/ws_server2.js"));

app.use(express.static(public_directory));
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: false }));

app.set('views', views_directory);
app.set('view engine', 'hbs');

//app.use('/map', map);
app.use('/mailing_list', mailing_list);
app.use('/whatsapp', whatsapp);
app.use('/task', task);
app.use('/transport', transport);
app.use('/rtc', webrtc);
//app.use('/bjana_flipbook', bjana_flipbook);
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, "../templates/views/mailing_list.html"))
})

//const wss = new ws.WebSocketServer({ noServer: true });
//wss.on('connection', ws_server.handler);
const wss2 = new ws.WebSocketServer({ noServer: true });
wss2.on('connection', ws_server2.handler);

const server = http.createServer(app);

server.on('upgrade', (request, socket, head) => {
	const { pathname } = url.parse(request.url);

	if (pathname === '/connect') {
		wss.handleUpgrade(request, socket, head, (socket) => {
			wss.emit('connection', socket, request);
		})
	} else if (pathname === '/rtc') {
		wss2.handleUpgrade(request, socket, head, (socket) => {
			wss2.emit('connection', socket, request);
		})
	}
})

server.listen(port, () => {
	console.log(`Screenshop.xyz is up on port ${port}!`);
})
