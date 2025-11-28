export default abstract class Tool {
	protected canvas: HTMLCanvasElement;
	protected ctx: CanvasRenderingContext2D;

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;

		const context = this.canvas.getContext('2d');
		if (!context) {
			throw new Error('Could not get 2D context from canvas');
		}

		this.ctx = context;

		this.attach();
	}

	private attach(): void {
		this.canvas.addEventListener('mousedown', this._onMouseDown);
		this.canvas.addEventListener('mousemove', this._onMouseMove);
		window.addEventListener('mouseup', this._onMouseUp);
	}

	destroy(): void {
		this.canvas.removeEventListener('mousedown', this._onMouseDown);
		this.canvas.removeEventListener('mousemove', this._onMouseMove);
		window.removeEventListener('mouseup', this._onMouseUp);
	}

	private _onMouseDown = (e: MouseEvent): void => {
		this.onMouseDown(e);
	};
	private _onMouseMove = (e: MouseEvent): void => {
		this.onMouseMove(e);
	};
	private _onMouseUp = (e: MouseEvent): void => {
		this.onMouseUp(e);
	};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	protected onMouseDown(_e: MouseEvent): void {}
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	protected onMouseMove(_e: MouseEvent): void {}
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	protected onMouseUp(_e: MouseEvent): void {}

	protected getPos(e: MouseEvent): { x: number; y: number } {
		const rect = this.canvas.getBoundingClientRect();
		return {
			x: e.clientX - rect.left,
			y: e.clientY - rect.top,
		};
	}
}
