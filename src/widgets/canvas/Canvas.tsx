import { useEffect, useRef } from 'react';
import styles from './canvas.module.scss';
import canvasState from '@shared/store/canvasState';
import Brush from '@shared/tools/brush';
import toolState from '@shared/store/toolState';
import { observer } from 'mobx-react-lite';
import { loadRoomImage } from '@shared/api/image';

type Props = {
	width?: number;
	height?: number;
};

const Canvas = observer(({ width = 800, height = 600 }: Props) => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	const socket = canvasState.socket;
	const sessionId = canvasState.sessionId;

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		canvasState.setCanvas(canvas);

		return () => {
			canvasState.setCanvas(null);
		};
	}, []);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const brush = new Brush(canvas, socket, sessionId);
		toolState.setTool(brush, 'brush');

		return () => {
			brush.destroy();
			toolState.setTool(null, null);
		};
	}, [socket, sessionId]);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas || !sessionId) return;

		loadRoomImage(sessionId, canvas);
	}, [sessionId]);

	return (
		<div className={styles.canvas}>
			<canvas ref={canvasRef} width={width} height={height} style={{ cursor: toolState.cursor }} />
		</div>
	);
});

export default Canvas;
