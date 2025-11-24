import { useEffect, useRef } from 'react';
import styles from './canvas.module.scss';
import canvasState from '@shared/store/canvasState';
import Brush from '@shared/tools/brush';
import toolState from '@shared/store/toolState';

type Props = {
	width?: number;
	height?: number;
};

const Canvas = ({ width = 800, height = 600 }: Props) => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		canvasState.setCanvas(canvas);

		const brush = new Brush(canvas);
		toolState.setTool(brush, 'brush');

		return () => {
			canvasState.setCanvas(null);
			toolState.setTool(null, null);
		};
	}, []);

	return (
		<div className={styles.canvas}>
			<canvas ref={canvasRef} width={width} height={height} />
		</div>
	);
};

export default Canvas;
