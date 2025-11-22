import { makeAutoObservable } from 'mobx';

class CanvasState {
	canvas: HTMLCanvasElement | null = null;

	constructor() {
		makeAutoObservable(this);
	}

	setCanvas(canvas: HTMLCanvasElement | null) {
		this.canvas = canvas;
	}
}

const canvasState = new CanvasState();
export default canvasState;
