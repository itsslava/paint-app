export type FigureType = 'brush' | 'rectangle' | 'circle' | 'line' | 'eraser' | 'finish';

export type Figure = {
	type: FigureType;

	x: number;
	y: number;

	x2?: number;
	y2?: number;

	w?: number;
	h?: number;
	r?: number;

	strokeColor?: string;
	fillColor?: string;
	lineWidth?: number;
};

export type ConnectionMessage = {
	method: 'connection';
	id: string;
	username: string;
};

export type DrawMessage = {
	method: 'draw';
	id: string;
	figure: Figure;
};

export type FinishMessage = {
	method: 'finish';
	id: string;
};

export type WsMessage = ConnectionMessage | DrawMessage | FinishMessage;
