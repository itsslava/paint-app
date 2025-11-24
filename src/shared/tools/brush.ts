import Tool from './tool';

export default class Brush extends Tool {
	private isDrawing = false;

	constructor(canvas: HTMLCanvasElement) {
		super(canvas);
		this.attach();
	}

	private attach(): void {
		this.canvas.addEventListener('mousedown', this.handleMouseDown);
		this.canvas.addEventListener('mousemove', this.handleMouseMove);
		this.canvas.addEventListener('mouseup', this.handleMouseUp);
	}

	private handleMouseDown = (e: MouseEvent): void => {
		this.isDrawing = true;

		const { x, y } = this.getPos(e);

		this.ctx.beginPath();
		this.ctx.moveTo(x, y);
	};

	private handleMouseMove = (e: MouseEvent) => {
		if (!this.isDrawing) return;

		const { x, y } = this.getPos(e);
		this.draw(x, y);
	};

	private handleMouseUp = () => {
		if (!this.isDrawing) return;
		this.isDrawing = false;

		this.ctx.closePath();
	};

	private draw(x: number, y: number): void {
		this.ctx.lineTo(x, y);
		this.ctx.stroke();
	}

	override destroy() {
		this.canvas.removeEventListener('mousedown', this.handleMouseDown);
		this.canvas.removeEventListener('mousemove', this.handleMouseMove);
		this.canvas.removeEventListener('mouseup', this.handleMouseUp);
	}
}
