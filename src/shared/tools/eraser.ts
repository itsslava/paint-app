import Tool from './tool';

export default class Eraser extends Tool {
	private isDrawing = false;

	constructor(canvas: HTMLCanvasElement) {
		super(canvas);
		this.attach();
	}

	private attach(): void {
		this.canvas.addEventListener('mousedown', this.handleMouseDown);
		this.canvas.addEventListener('mousemove', this.handleMouseMove);
		window.addEventListener('mouseup', this.handleMouseUp);
	}

	override destroy(): void {
		this.canvas.removeEventListener('mousedown', this.handleMouseDown);
		this.canvas.removeEventListener('mousemove', this.handleMouseMove);
		window.removeEventListener('mouseup', this.handleMouseUp);
	}

	private draw(x: number, y: number): void {
		this.ctx.lineTo(x, y);
		this.ctx.stroke();
	}

	private handleMouseDown = (e: MouseEvent): void => {
		this.isDrawing = true;

		const { x, y } = this.getPos(e);

		this.ctx.globalCompositeOperation = 'destination-out';

		this.ctx.beginPath();
		this.ctx.moveTo(x, y);
	};

	private handleMouseMove = (e: MouseEvent): void => {
		if (!this.isDrawing) return;

		const { x, y } = this.getPos(e);
		this.draw(x, y);
	};

	private handleMouseUp = (): void => {
		if (!this.isDrawing) return;
		this.isDrawing = false;

		this.ctx.globalCompositeOperation = 'source-over';

		this.ctx.closePath();
	};
}
