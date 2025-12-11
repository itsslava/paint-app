import { makeAutoObservable } from 'mobx';

class CanvasState {
	canvas: HTMLCanvasElement | null = null;

	socket: WebSocket | null = null;
	sessionId: string | null = null;

	private undoStack: string[] = [];
	private redoStack: string[] = [];

	username: string = '';

	private readonly MAX_HISTORY = 20;

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true });
	}

	setSessionId(id: string) {
		this.sessionId = id;
	}
	setSocket(socket: WebSocket) {
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
