import Tool from './tool';

export default class Rectangle extends Tool {
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

		const { x: currentX, y: currentY } = this.getPos(e);

		const width = currentX - this.startX;
		const height = currentY - this.startY;

		this.ctx.putImageData(this.startImage, 0, 0);
		this.drawRect(this.startX, this.startY, width, height);
	}

	protected override onMouseUp(e: MouseEvent): void {
		if (!this.isDrawing || !this.startImage) return;
		this.isDrawing = false;

		const { x: currentX, y: currentY } = this.getPos(e);
		const width = currentX - this.startX;
		const height = currentY - this.startY;

		this.ctx.putImageData(this.startImage, 0, 0);
		this.drawRect(this.startX, this.startY, width, height);

		this.startImage = null;

		if (this.socket && this.id) {
			this.socket.send(
				JSON.stringify({
					method: 'draw',
					id: this.id,
					figure: {
						type: 'rectangle',
						x: this.startX,
						y: this.startY,
						w: width,
						h: height,
						fillColor: this.ctx.fillStyle as string,
						strokeColor: this.ctx.strokeStyle as string,
						lineWidth: this.ctx.lineWidth,
					},
				})
			);
		}
	}

	static draw(
		ctx: CanvasRenderingContext2D,
		x: number,
		y: number,
		width: number,
		height: number
	): void {
		ctx.beginPath();
		ctx.rect(x, y, width, height);
		ctx.stroke();
		ctx.fill();
	}

	private drawRect(x: number, y: number, width: number, height: number): void {
		this.ctx.beginPath();
		this.ctx.rect(x, y, width, height);
		this.ctx.stroke();
		this.ctx.fill();
	}
}
