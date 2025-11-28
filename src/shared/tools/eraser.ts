import Tool from './tool';

export default class Eraser extends Tool {
	private isDrawing = false;

	constructor(canvas: HTMLCanvasElement) {
		super(canvas);
	}

	protected override onMouseDown(e: MouseEvent): void {
		this.isDrawing = true;

		const { x, y } = this.getPos(e);

		this.ctx.globalCompositeOperation = 'destination-out';

		this.ctx.beginPath();
		this.ctx.moveTo(x, y);
	}

	protected override onMouseMove(e: MouseEvent): void {
		if (!this.isDrawing) return;

		const { x, y } = this.getPos(e);
		this.draw(x, y);
	}

	protected override onMouseUp(): void {
		if (!this.isDrawing) return;
		this.isDrawing = false;

		this.ctx.globalCompositeOperation = 'source-over';

		this.ctx.closePath();
	}

	private draw(x: number, y: number): void {
		this.ctx.lineTo(x, y);
		this.ctx.stroke();
	}
}
