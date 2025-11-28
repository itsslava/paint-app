import Tool from './tool';

export default class Line extends Tool {
	private isDrawing = false;

	private startX = 0;
	private startY = 0;
	private startImage: ImageData | null = null;

	constructor(canvas: HTMLCanvasElement) {
		super(canvas);
	}

	protected override onMouseDown(e: MouseEvent): void {
		this.isDrawing = true;

		const { x, y } = this.getPos(e);
		this.startX = x;
		this.startY = y;

		this.startImage = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
	}

	protected override onMouseMove(e: MouseEvent): void {
		if (!this.isDrawing || !this.startImage) return;

		const { x, y } = this.getPos(e);

		this.ctx.putImageData(this.startImage, 0, 0);

		this.ctx.beginPath();
		this.ctx.moveTo(this.startX, this.startY);
		this.ctx.lineTo(x, y);
		this.ctx.stroke();
	}

	protected override onMouseUp(): void {
		if (!this.isDrawing) return;

		this.isDrawing = false;
		this.startImage = null;
	}
}
