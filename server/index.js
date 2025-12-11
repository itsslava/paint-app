const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const WSserver = require('express-ws')(app);
const aWss = WSserver.getWss();
const PORT = process.env.PORT || 5050;

const MESSAGE_METHODS = {
	CONNECTION: 'connection',
	DRAW: 'draw',
	FINISH: 'finish',
};

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const filesDir = path.resolve(__dirname, 'files');
if (!fs.existsSync(filesDir)) {
	fs.mkdirSync(filesDir);
}

const connectionHandler = (ws, msg) => {
	ws.id = msg.id;
	broadcastConnection(ws, msg);
};

const broadcastConnection = (ws, msg) => {
	if (!msg || !msg.id) return;

	aWss.clients.forEach((client) => {
		if (client.id === msg.id) {
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
			console.error('INVALID JSON:', raw);
			return;
		}

		switch (msg.method) {
			case MESSAGE_METHODS.CONNECTION:
				connectionHandler(ws, msg);
				break;
			case MESSAGE_METHODS.DRAW:
				broadcastConnection(ws, msg);
				break;
			case MESSAGE_METHODS.FINISH:
				broadcastConnection(ws, msg);
				break;
			default:
				console.error('UNKNOWN METHOD:', msg.method);
		}
	});
});

app.post('/image', (req, res) => {
	const roomId = req.query.id;
	if (!roomId) {
		return res.status(400).json({ error: 'id query param is required' });
	}

	const imgDataUrl = req.body.img;
	if (typeof imgDataUrl !== 'string') {
		return res.status(400).json({ error: 'img field must be a string' });
	}

	const prefix = 'data:image/png;base64,';
	const base64Data = imgDataUrl.startsWith(prefix) ? imgDataUrl.replace(prefix, '') : imgDataUrl;

	const filePath = path.resolve(filesDir, `${roomId}.png`);

	try {
		fs.writeFileSync(filePath, base64Data, 'base64');
		res.json({ status: 'ok' });
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: 'failed to save image' });
	}
});

app.get('/image', (req, res) => {
	const roomId = req.query.id;
	if (!roomId) {
		return res.status(400).json({ error: 'id query param is required' });
	}

	const filePath = path.resolve(filesDir, `${roomId}.png`);

	if (!fs.existsSync(filePath)) {
		return res.status(204).end();
	}

	try {
		const base64Data = fs.readFileSync(filePath, 'base64');
		const dataUrl = `data:image/png;base64,${base64Data}`;
		res.json({ img: dataUrl });
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: 'failed to read image' });
	}
});

app.listen(PORT, () => {
	console.log(`server started at ${PORT} port`);
});
