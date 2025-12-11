import type { Figure } from '@shared/types/drawing';
import { Brush, Rectangle, Line, Circle, Eraser } from '@shared/tools';

export default function applyFigureOnContext(ctx: CanvasRenderingContext2D, figure: Figure): void {
	if (figure.strokeColor) {
		ctx.strokeStyle = figure.strokeColor;
	}
	if (figure.fillColor) {
		ctx.fillStyle = figure.fillColor;
	}
	if (typeof figure.lineWidth === 'number') {
		ctx.lineWidth = figure.lineWidth;
	}

	switch (figure.type) {
		case 'brush':
			Brush.draw(ctx, figure.x, figure.y);
			return;

		case 'eraser': {
			const prevOp = ctx.globalCompositeOperation;
			ctx.globalCompositeOperation = 'destination-out';

			Eraser.draw(ctx, figure.x, figure.y);

			ctx.globalCompositeOperation = prevOp;
			return;
		}

		case 'rectangle': {
			const width = figure.w ?? 0;
			const height = figure.h ?? 0;
			Rectangle.draw(ctx, figure.x, figure.y, width, height);
			return;
		}

		case 'circle': {
			const radius = figure.r ?? 0;
			Circle.draw(ctx, figure.x, figure.y, radius);
			return;
		}

		case 'line': {
			const x2 = figure.x2 ?? figure.x;
			const y2 = figure.y2 ?? figure.y;
			Line.draw(ctx, figure.x, figure.y, x2, y2);
			return;
		}
		// finish — логический конец фигуры/штриха: сброс режимов и разрыв path
		case 'finish':
			ctx.globalCompositeOperation = 'source-over';
			ctx.beginPath();
			return;

		default:
			console.log('Unknown figure type', figure);
	}
}
