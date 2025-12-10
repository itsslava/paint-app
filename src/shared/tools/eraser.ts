import Tool from './tool';

export default class Eraser extends Tool {
	private isDrawing = false;

	constructor(canvas: HTMLCanvasElement, socket?: WebSocket | null, id?: string | null) {
		super(canvas, socket, id ?? null);
		this.canvas.addEventListener('mouseleave', this.onMouseLeave);
	}

	override destroy(): void {
		this.canvas.removeEventListener('mouseleave', this.onMouseLeave);
		super.destroy();
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

		this.ctx.lineTo(x, y);
		this.ctx.stroke();

		if (this.socket && this.id) {
			this.socket.send(
				JSON.stringify({
					method: 'draw',
					id: this.id,
					figure: {
						type: 'eraser',
						x,
						y,
						lineWidth: this.ctx.lineWidth,
					},
				})
			);
		}
	}

	protected override onMouseUp(): void {
		if (!this.isDrawing) return;
		this.isDrawing = false;

		this.ctx.globalCompositeOperation = 'source-over';

		if (this.socket && this.id) {
			this.socket.send(
				JSON.stringify({
					method: 'draw',
					id: this.id,
					figure: {
						type: 'finish',
					},
				})
			);
		}

		this.ctx.closePath();
	}

	private onMouseLeave = (): void => {
		if (!this.isDrawing) return;

		this.isDrawing = false;

		this.ctx.globalCompositeOperation = 'source-over';

		if (this.socket && this.id) {
			this.socket.send(
				JSON.stringify({
					method: 'draw',
					id: this.id,
					figure: {
						type: 'finish',
					},
				})
			);
		}

		this.ctx.closePath();
	};

	static draw(ctx: CanvasRenderingContext2D, x: number, y: number): void {
		ctx.lineTo(x, y);
		ctx.stroke();
	}
}
