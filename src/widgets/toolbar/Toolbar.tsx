import { observer } from 'mobx-react-lite';
import toolState, { type ToolType } from '@shared/store/toolState';
import canvasState from '@shared/store/canvasState';
import { IconButton } from '@shared/ui';
import { Brush, Circle, Eraser, Line, Rectangle, Tool } from '@shared/tools';
import * as Icon from '@shared/icons';

import styles from './toolbar.module.scss';
import type { JSX } from 'react';

const toolFactory: Partial<
	Record<
		ToolType,
		new (canvas: HTMLCanvasElement, socket?: WebSocket | null, id?: string | null) => Tool
	>
> = {
	brush: Brush,
	line: Line,
	rectangle: Rectangle,
	circle: Circle,
	eraser: Eraser,
};

type ActionKey = 'undo' | 'redo' | 'save' | 'clear';

const toolButtons: Array<{
	key: ToolType;
	label: string;
	Icon: (props: { className?: string }) => JSX.Element;
}> = [
	{ key: 'brush', label: 'Brush', Icon: Icon.BrushIcon },
	{ key: 'line', label: 'Line', Icon: Icon.LineIcon },
	{ key: 'rectangle', label: 'Rectangle', Icon: Icon.RectangleIcon },
	{ key: 'circle', label: 'Circle', Icon: Icon.CircleIcon },
	{ key: 'eraser', label: 'Eraser', Icon: Icon.EraserIcon },
];

const actionButtons: Array<{
	key: ActionKey;
	label: string;
	Icon: (props: { className?: string }) => JSX.Element;
}> = [
	{ key: 'undo', label: 'Undo', Icon: Icon.UndoIcon },
	{ key: 'redo', label: 'Redo', Icon: Icon.RedoIcon },
	{ key: 'save', label: 'Save', Icon: Icon.SaveIcon },
	{ key: 'clear', label: 'Clear', Icon: Icon.ClearIcon },
];

const ToolBar = observer(() => {
	const handleSelect = (key: ToolType) => {
		const canvas = canvasState.canvas;
		if (!canvas) return;

		const ToolCtor = toolFactory[key];
		if (!ToolCtor) return;

		const socket = canvasState.socket ?? null;
		const sessionId = canvasState.sessionId ?? null;

		const instance = new ToolCtor(canvas, socket, sessionId);
		toolState.setTool(instance, key);
	};

	const handleAction = (key: ActionKey) => {
		switch (key) {
			case 'undo':
				canvasState.undo();
				break;
			case 'redo':
				canvasState.redo();
				break;
			case 'save':
				canvasState.downloadImage();
				break;
			case 'clear':
				canvasState.clear();
				break;
		}
	};

	const getActionDisabled = (key: ActionKey): boolean => {
		if (!canvasState.canvas) {
			return true;
		}

		if (key === 'undo' || key === 'clear') {
			return !canvasState.canUndo;
		}

		if (key === 'redo') {
			return !canvasState.canRedo;
		}

		return false;
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
			<div className={styles.toolbar__group} role="group" aria-label="Actions">
				{actionButtons.map(({ key, label, Icon }) => (
					<IconButton
						key={key}
						label={label}
						disabled={getActionDisabled(key)}
						onClick={() => handleAction(key)}
					>
						<Icon className={styles.toolbar__icon} />
					</IconButton>
				))}
			</div>
		</div>
	);
});

export default ToolBar;
