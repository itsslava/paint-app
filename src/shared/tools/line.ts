import Tool from './tool';

export default class Line extends Tool {
	private isDrawing = false;

	private startX = 0;
	private startY = 0;
	private startImage: ImageData | null = null;

	constructor(canvas: HTMLCanvasElement, socket?: WebSocket | null, id?: string | null) {
		super(canvas, socket, id ?? null);
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
		Line.draw(this.ctx, this.startX, this.startY, x, y);
	}

	protected override onMouseUp(e: MouseEvent): void {
		if (!this.isDrawing || !this.startImage) return;

		this.isDrawing = false;

		const { x: endX, y: endY } = this.getPos(e);

		this.ctx.putImageData(this.startImage, 0, 0);
		Line.draw(this.ctx, this.startX, this.startY, endX, endY);

		this.startImage = null;

		if (this.socket && this.id) {
			this.socket.send(
				JSON.stringify({
					method: 'draw',
					id: this.id,
					figure: {
						type: 'line',
						x: this.startX,
						y: this.startY,
						x2: endX,
						y2: endY,
						strokeColor: this.ctx.strokeStyle as string,
						lineWidth: this.ctx.lineWidth,
					},
				})
			);
		}
	}

	static draw(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number): void {
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.stroke();
	}
}
