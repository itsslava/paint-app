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
	socket: WebSocket | null;
	sessionId: string | null;
};

const Canvas = observer(({ width = 800, height = 600, socket, sessionId }: Props) => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	// 1) Маунтим канвас в стор один раз
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		canvasState.setCanvas(canvas);

		return () => {
			canvasState.setCanvas(null);
		};
	}, []);

	// 2) Создаём / пересоздаём базовый инструмент, когда меняются socket/sessionId
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

	// 3) Подгружаем сохранённое изображение комнаты
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas || !sessionId) return;

		loadRoomImage(sessionId, canvas);
	}, [sessionId]);

	// useEffect(() => {
	// 	const canvas = canvasRef.current;
	// 	if (!canvas) return;

	// 	canvasState.setCanvas(canvas);

	// 	const brush = new Brush(canvas, socket, sessionId);
	// 	toolState.setTool(brush, 'brush');

	// 	if (sessionId) {
	// 		loadRoomImage(sessionId, canvas);
	// 	}

	// 	return () => {
	// 		brush.destroy();
	// 		canvasState.setCanvas(null);
	// 		toolState.setTool(null, null);
	// 	};
	// }, [socket, sessionId]);

	return (
		<div className={styles.canvas}>
			<canvas ref={canvasRef} width={width} height={height} style={{ cursor: toolState.cursor }} />
		</div>
	);
});

export default Canvas;
