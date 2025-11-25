import Tool from './tool';

export default class Rectangle extends Tool {
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
		window.addEventListener('mouseup', this.handleMouseUp);
	}

	override destroy(): void {
		this.canvas.removeEventListener('mousedown', this.handleMouseDown);
		this.canvas.removeEventListener('mousemove', this.handleMouseMove);
		window.removeEventListener('mouseup', this.handleMouseUp);
	}

	private draw(x: number, y: number, width: number, height: number): void {
		this.ctx.beginPath();
		this.ctx.rect(x, y, width, height);
		this.ctx.stroke();
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

		const { x: currentX, y: currentY } = this.getPos(e);

		const width = currentX - this.startX;
		const height = currentY - this.startY;

		this.ctx.putImageData(this.startImage, 0, 0);

		this.draw(this.startX, this.startY, width, height);
	};

	private handleMouseUp = (): void => {
		if (!this.isDrawing) return;
		this.isDrawing = false;
		this.ctx.closePath();
		this.startImage = null;
	};
}
