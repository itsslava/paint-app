import { observer } from 'mobx-react-lite';
import toolState, { type ToolType } from '@shared/store/toolState';
import canvasState from '@shared/store/canvasState';
import { IconButton } from '@shared/ui';
import { Brush, Line, Rectangle } from '@shared/tools';
import { BrushIcon, LineIcon, RectangleIcon } from '@shared/icons';

import styles from './toolbar.module.scss';

const ToolBar = observer(() => {
	const handleSelect = (key: ToolType) => {
		const canvas = canvasState.canvas;

		if (!canvas) return;

		if (key === 'brush') {
			const instance = new Brush(canvas);
			toolState.setTool(instance, key);
		} else if (key === 'line') {
			const instance = new Line(canvas);
			toolState.setTool(instance, key);
		} else if (key === 'rectangle') {
			const instance = new Rectangle(canvas);
			toolState.setTool(instance, key);
		}
	};
	return (
		<div className={styles.toolbar} role="toolbar" aria-label="Drawing tools">
			<div className={styles.toolbar__group} role="group" aria-label="Tools">
				<IconButton
					label="Brush"
					active={toolState.activeTool === 'brush'}
					disabled={!canvasState.canvas}
					onClick={() => handleSelect('brush')}
				>
					<BrushIcon className={styles.toolbar__icon} />
				</IconButton>
				<IconButton
					label="Line"
					active={toolState.activeTool === 'line'}
					disabled={!canvasState.canvas}
					onClick={() => handleSelect('line')}
				>
					<LineIcon className={styles.toolbar__icon} />
				</IconButton>
				<IconButton
					label="Rectangle"
					active={toolState.activeTool === 'rectangle'}
					disabled={!canvasState.canvas}
					onClick={() => handleSelect('rectangle')}
				>
					<RectangleIcon className={styles.toolbar__icon} />
				</IconButton>
			</div>
			<div className={styles.toolbar__group} role="group" aria-label="Actions"></div>
		</div>
	);
});

export default ToolBar;
