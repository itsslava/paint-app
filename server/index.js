const express = require('express');
const app = express();
const WSserver = require('express-ws')(app);

const PORT = process.env.PORT || 5050;

app.ws('/', (ws, req) => {
	console.log('CONNECTION SETTLED');
	ws.send('you are succesfuly connected');
	ws.on('message', (msg) => {
		console.log(msg);
	});
});

app.listen(PORT, () => {
	console.log(`server started at ${PORT} port`);
});
