import { useEffect, useRef } from 'react';
import styles from './canvas.module.scss';
import canvasState from '@shared/store/canvasState';
import Brush from '@shared/tools/brush';
import toolState from '@shared/store/toolState';
import { observer } from 'mobx-react-lite';

type Props = {
	width?: number;
	height?: number;
	socket: WebSocket | null;
	sessionId: string | null;
};

const Canvas = observer(({ width = 800, height = 600, socket, sessionId }: Props) => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		canvasState.setCanvas(canvas);

		const brush = new Brush(canvas, socket, sessionId);
		toolState.setTool(brush, 'brush');

		return () => {
			brush.destroy();
			canvasState.setCanvas(null);
			toolState.setTool(null, null);
		};
	}, [socket, sessionId]);

	return (
		<div className={styles.canvas}>
			<canvas ref={canvasRef} width={width} height={height} style={{ cursor: toolState.cursor }} />
		</div>
	);
});

export default Canvas;
