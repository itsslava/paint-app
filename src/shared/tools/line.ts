import Tool from './tool';

export default class Line extends Tool {
	private isDrawing = false;

	private startX = 0;
	private startY = 0;
	private startImage: ImageData | null = null;

	constructor(canvas: HTMLCanvasElement) {
		super(canvas);
		this.attach();
	}

	private attach(): void {
		this.canvas.addEventListener('mousedown', this.handleMouseDown);
		this.canvas.addEventListener('mousemove', this.handleMouseMove);
		// this.canvas.addEventListener('mouseup', this.handleMouseUp);
		window.addEventListener('mouseup', this.handleMouseUp);
	}

	private handleMouseDown = (e: MouseEvent): void => {
		this.isDrawing = true;

		const { x, y } = this.getPos(e);
		this.startX = x;
		this.startY = y;

		this.startImage = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
	};
	private handleMouseMove = (e: MouseEvent): void => {
		if (!this.isDrawing || !this.startImage) return;

		const { x, y } = this.getPos(e);

		this.ctx.putImageData(this.startImage, 0, 0);

		this.ctx.beginPath();
		this.ctx.moveTo(this.startX, this.startY);
		this.ctx.lineTo(x, y);
		this.ctx.stroke();
	};
	private handleMouseUp = (): void => {
		if (!this.isDrawing) return;

		this.isDrawing = false;
		this.startImage = null;
	};

	override destroy() {
		this.canvas.removeEventListener('mousedown', this.handleMouseDown);
		this.canvas.removeEventListener('mousemove', this.handleMouseMove);
		this.canvas.removeEventListener('mouseup', this.handleMouseUp);
	}
}
