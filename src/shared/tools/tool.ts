export default class Tool {
	protected canvas: HTMLCanvasElement;
	protected ctx: CanvasRenderingContext2D;

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		const context = this.canvas.getContext('2d');

		if (!context) {
			throw new Error('Could not get 2D context from canvas');
		}

		this.ctx = context;
	}

	protected onMouseDown(): void {}
	protected onMouseUp(): void {}
	protected onMouseMove(): void {}

	protected getPos(e: MouseEvent): { x: number; y: number } {
		const rect = this.canvas.getBoundingClientRect();
		return {
			x: e.clientX - rect.left,
			y: e.clientY - rect.top,
		};
	}

	destroy() {
		this.canvas.onmousedown = null;
		this.canvas.onmouseup = null;
		this.canvas.onmousemove = null;
	}
}
