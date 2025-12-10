const express = require('express');
const app = express();
const WSserver = require('express-ws')(app);
const aWss = WSserver.getWss();

const PORT = process.env.PORT || 5050;

const connectionHandler = (ws, msg) => {
	ws.id = msg.id;
	broadcastConnection(ws, msg);
};

const broadcastConnection = (ws, msg) => {
	aWss.clients.forEach((client) => {
		if (client !== ws && client.id === msg.id) {
			client.send(JSON.stringify(msg));
		}
	});
};

app.ws('/', (ws, req) => {
	ws.on('message', (raw) => {
		let msg;
		try {
			msg = JSON.parse(raw);
		} catch (e) {
			console.log('INVALID JSON:', raw);
			return;
		}

		switch (msg.method) {
			case 'connection':
				connectionHandler(ws, msg);
				break;
			case 'draw':
				broadcastConnection(ws, msg);
				break;
			case 'finish':
				broadcastConnection(ws, msg);
				break;
			default:
				console.log('UNKNOWN METHOD:', msg.method);
		}
	});
});

app.listen(PORT, () => {
	console.log(`server started at ${PORT} port`);
});
