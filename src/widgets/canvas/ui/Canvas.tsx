type Props = {
	width?: number;
	height?: number;
};

const Canvas = ({ width = 800, height = 600 }: Props) => {
	return (
		<div>
			<canvas width={width} height={height} />
		</div>
	);
};

export default Canvas;
