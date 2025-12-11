import Tool from './tool';

export default class Circle extends Tool {
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

		const dx = currentX - this.startX;
		const dy = currentY - this.startY;
		const radius = Math.sqrt(dx * dx + dy * dy);

		this.ctx.putImageData(this.startImage, 0, 0);
		Circle.draw(this.ctx, this.startX, this.startY, radius);
	}

	protected override onMouseUp(e: MouseEvent): void {
		if (!this.isDrawing || !this.startImage) return;
		this.isDrawing = false;

		const { x: currentX, y: currentY } = this.getPos(e);
		const dx = currentX - this.startX;
		const dy = currentY - this.startY;
		const radius = Math.sqrt(dx * dx + dy * dy);

		this.ctx.putImageData(this.startImage, 0, 0);
		Circle.draw(this.ctx, this.startX, this.startY, radius);

		this.startImage = null;

		if (this.socket && this.id) {
			this.socket.send(
				JSON.stringify({
					method: 'draw',
					id: this.id,
					figure: {
						type: 'circle',
						x: this.startX,
						y: this.startY,
						r: radius,
						fillColor: this.ctx.fillStyle as string,
						strokeColor: this.ctx.strokeStyle as string,
						lineWidth: this.ctx.lineWidth,
					},
				})
			);
		}
	}

	static draw(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number): void {
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, Math.PI * 2);
		ctx.stroke();
		ctx.fill();
	}
}
