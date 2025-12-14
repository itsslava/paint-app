import { saveRoomImage } from '@shared/api';
import { applyFigureOnContext } from '@shared/lib';
import type { DrawMessage, WsMessage } from '@shared/types/drawing';
import { makeAutoObservable } from 'mobx';

type SessionMode = 'local' | 'shared';
type ConnectionStatus = 'idle' | 'connecting' | 'online' | 'error';

class CanvasState {
	canvas: HTMLCanvasElement | null = null;

	socket: WebSocket | null = null;
	sessionId: string | null = null;

	username: string = '';

	sessionMode: SessionMode = 'local';
	connectionStatus: ConnectionStatus = 'idle';

	private undoStack: string[] = [];
	private redoStack: string[] = [];

	private readonly MAX_HISTORY = 20;

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true });
	}

	setSessionId(id: string | null) {
		this.sessionId = id;
	}
	setSocket(socket: WebSocket | null) {
		this.socket = socket;
	}
	setUsername(username: string) {
		this.username = username;
	}

	setCanvas(canvas: HTMLCanvasElement | null) {
		this.canvas = canvas;
		this.clearHistory();
	}

	private clearHistory() {
		this.undoStack = [];
		this.redoStack = [];
	}

	// ws

	startSharing(roomId: string, username: string) {
		if (!roomId) {
			console.log('No room id');
			return;
		}

		if (this.socket) {
			try {
				this.socket.onclose = null;
				this.socket.close();
			} catch (e) {
				console.log('Failed to close socket', e);
			}
			this.socket = null;
		}

		this.username = username;
		this.sessionId = roomId;
		this.sessionMode = 'shared';
		this.connectionStatus = 'connecting';

		if (this.canvas) {
			saveRoomImage(roomId, this.canvas);
		}

		const ws = new WebSocket('ws://localhost:5050/');
		this.socket = ws;

		ws.onopen = () => {
			console.log('socket opened');
			this.connectionStatus = 'online';

			ws.send(
				JSON.stringify({
					id: roomId,
					username,
					method: 'connection',
				})
			);
		};

		ws.onmessage = (event: MessageEvent) => {
			const msg: WsMessage = JSON.parse(event.data);

			switch (msg.method) {
				case 'connection':
					console.log(`user ${msg.username} connected`);
					break;
				case 'draw':
					this.handleDrawMessage(msg);
					break;
				case 'finish':
					break;
				default:
					console.log('Unknown method:', msg);
			}
		};

		ws.onerror = (event) => {
			console.log('WS ERROR:', event);
			this.connectionStatus = 'error';
		};

		ws.onclose = () => {
			console.log('socket closed');
			this.socket = null;
			this.connectionStatus = 'idle';
			this.sessionMode = 'local';
		};
	}

	stopSharing() {
		if (this.socket) {
			try {
				this.socket.onclose = null;
				this.socket.close();
			} catch (e) {
				console.error('Failed to close socket', e);
			}
		}

		this.socket = null;
		this.connectionStatus = 'idle';
		this.sessionMode = 'local';
	}

	private handleDrawMessage(msg: DrawMessage) {
		if (!msg.figure) return;

		const canvas = this.canvas;
		if (!canvas) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		applyFigureOnContext(ctx, msg.figure);

		const roomId = this.sessionId;
		if (!roomId) return;

		const { type } = msg.figure;

		const shouldSave =
			type === 'line' || type === 'rectangle' || type === 'circle' || type === 'finish';

		if (shouldSave) {
			saveRoomImage(roomId, canvas);
		}
	}

	// undo,redo,clear,save

	saveCurrentToUndo() {
		if (!this.canvas) return;

		const dataUrl = this.canvas.toDataURL();
		this.undoStack.push(dataUrl);

		if (this.undoStack.length > this.MAX_HISTORY) {
			this.undoStack.shift();
		}

		this.redoStack = [];
	}

	private drawFromDataUrl(dataUrl: string) {
		if (!this.canvas) return;

		const ctx = this.canvas.getContext('2d');
		if (!ctx) return;

		const img = new Image();
		img.src = dataUrl;

		img.onload = () => {
			ctx.clearRect(0, 0, this.canvas!.width, this.canvas!.height);
			ctx.drawImage(img, 0, 0, this.canvas!.width, this.canvas!.height);
		};
	}

	clear() {
		if (!this.canvas) return;

		this.saveCurrentToUndo();

		const ctx = this.canvas.getContext('2d');
		if (!ctx) return;

		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	undo() {
		if (!this.canvas) return;
		if (this.undoStack.length === 0) return;

		const current = this.canvas.toDataURL();
		this.redoStack.push(current);

		const dataUrl = this.undoStack.pop();
		if (!dataUrl) return;

		this.drawFromDataUrl(dataUrl);
	}

	redo() {
		if (!this.canvas) return;
		if (this.redoStack.length === 0) return;

		const current = this.canvas.toDataURL();
		this.undoStack.push(current);

		const dataUrl = this.redoStack.pop();
		if (!dataUrl) return;

		this.drawFromDataUrl(dataUrl);
	}

	get canUndo() {
		return this.undoStack.length > 0;
	}

	get canRedo() {
		return this.redoStack.length > 0;
	}

	downloadImage(filename = 'drawing.png') {
		if (!this.canvas) return;

		const exportCanvas = document.createElement('canvas');
		const exportCtx = exportCanvas.getContext('2d');
		if (!exportCtx) return;

		exportCanvas.width = this.canvas.width;
		exportCanvas.height = this.canvas.height;

		exportCtx.fillStyle = '#ffffff';
		exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

		exportCtx.drawImage(this.canvas, 0, 0);

		const dataUrl = exportCanvas.toDataURL('image/png');

		const link = document.createElement('a');
		link.href = dataUrl;
		link.download = filename;

		// firefox
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
}

const canvasState = new CanvasState();
export default canvasState;
