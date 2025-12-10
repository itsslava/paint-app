import canvasState from '@shared/store/canvasState';

export default abstract class Tool {
	protected canvas: HTMLCanvasElement;
	protected ctx: CanvasRenderingContext2D;

	socket: WebSocket | null;
	id: string | null;

	constructor(canvas: HTMLCanvasElement, socket?: WebSocket | null, id?: string | null) {
		this.canvas = canvas;
		this.socket = socket ?? null;
		this.id = id ?? null;

		const context = this.canvas.getContext('2d', {
			willReadFrequently: true,
		} as CanvasRenderingContext2DSettings);

		if (!context) {
			throw new Error('Could not get 2D context from canvas');
		}

		this.ctx = context;

		this.attach();
	}

	protected attach(): void {
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
		canvasState.saveCurrentToUndo();
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

	set strokeColor(color: string) {
		this.ctx.strokeStyle = color;
	}
	set fillColor(color: string) {
		this.ctx.fillStyle = color;
	}
	set lineWidth(width: number) {
		this.ctx.lineWidth = width;
	}

	get cursor(): string {
		return 'crosshair';
	}
}
