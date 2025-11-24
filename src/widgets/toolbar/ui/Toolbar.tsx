import { IconButton } from '@shared/ui';
import styles from './toolbar.module.scss';
import { BrushIcon } from '@shared/icons';
import { observer } from 'mobx-react-lite';
import toolState, { type ToolType } from '@shared/store/toolState';
import canvasState from '@shared/store/canvasState';
import { Brush } from '@shared/tools';

const ToolBar = observer(() => {
	const activeTool = toolState.activeTool;
	const canvas = canvasState.canvas;

	const handleSelect = (key: ToolType) => {
		if (!canvas) return;

		if (key === 'brush') {
			const instance = new Brush(canvas);
			toolState.setTool(instance, key);
		}
	};
	return (
		<div className={styles.toolbar} role="toolbar" aria-label="Drawing tools">
			<div className={styles.toolbar__group} role="group" aria-label="Tools">
				<IconButton
					label="Brush"
					active={activeTool === 'brush'}
					disabled={!canvas}
					onClick={() => handleSelect('brush')}
				>
					<BrushIcon className={styles.toolbar__icon} />
				</IconButton>
			</div>
			<div className={styles.toolbar__group} role="group" aria-label="Actions"></div>
		</div>
	);
});

export default ToolBar;
