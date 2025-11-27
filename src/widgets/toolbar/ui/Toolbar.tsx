import { observer } from 'mobx-react-lite';
import toolState, { type ToolType } from '@shared/store/toolState';
import canvasState from '@shared/store/canvasState';
import { IconButton } from '@shared/ui';
import { Brush, Circle, Line, Rectangle, Tool } from '@shared/tools';
import { BrushIcon, CircleIcon, LineIcon, RectangleIcon } from '@shared/icons';

import styles from './toolbar.module.scss';
import type { JSX } from 'react';

const toolFactory: Partial<Record<ToolType, new (canvas: HTMLCanvasElement) => Tool>> = {
	brush: Brush,
	line: Line,
	rectangle: Rectangle,
	circle: Circle,
};

const toolButtons: Array<{
	key: ToolType;
	label: string;
	Icon: (props: { className?: string }) => JSX.Element;
}> = [
	{ key: 'brush', label: 'Brush', Icon: BrushIcon },
	{ key: 'line', label: 'Line', Icon: LineIcon },
	{ key: 'rectangle', label: 'Rectangle', Icon: RectangleIcon },
	{ key: 'circle', label: 'Circle', Icon: CircleIcon },
];

const ToolBar = observer(() => {
	const handleSelect = (key: ToolType) => {
		const canvas = canvasState.canvas;
		if (!canvas) return;

		const ToolCtor = toolFactory[key];
		if (!ToolCtor) return;

		const instance = new ToolCtor(canvas);
		toolState.setTool(instance, key);
	};
	return (
		<div className={styles.toolbar} role="toolbar" aria-label="Drawing tools">
			<div className={styles.toolbar__group} role="group" aria-label="Tools">
				{toolButtons.map(({ key, label, Icon }) => (
					<IconButton
						key={key}
						label={label}
						active={toolState.activeTool === key}
						disabled={!canvasState.canvas}
						onClick={() => handleSelect(key)}
					>
						<Icon className={styles.toolbar__icon} />
					</IconButton>
				))}
			</div>
			<div className={styles.toolbar__group} role="group" aria-label="Actions"></div>
		</div>
	);
});

export default ToolBar;
