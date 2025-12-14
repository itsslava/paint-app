import { observer } from 'mobx-react-lite';
import type { JSX } from 'react';

import toolState, { type ToolType } from '@shared/store/toolState';
import canvasState from '@shared/store/canvasState';
import { IconButton } from '@shared/ui';
import { Brush, Circle, Eraser, Line, Rectangle, Tool } from '@shared/tools';
import * as Icon from '@shared/icons';

import styles from './toolbar.module.scss';

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

type Props = {
	onStartSharing?: () => void;
	onStopSharing?: () => void;
};

const ToolBar = observer(({ onStartSharing, onStopSharing }: Props) => {
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

	const { sessionMode, connectionStatus, username } = canvasState;

	const statusLabel = (() => {
		switch (connectionStatus) {
			case 'online':
				return 'Online';
			case 'connecting':
				return 'Connecting...';
			case 'error':
				return 'Error';
			case 'idle':
			default:
				return sessionMode === 'shared' ? 'Disconnected' : 'Offline';
		}
	})();

	const modeLabel = sessionMode === 'shared' ? 'Shared mode' : 'Local mode';

	const statusDotClassName = [
		styles['toolbar__status-dot'],
		connectionStatus === 'online' && styles['toolbar__status-dot--online'],
		connectionStatus === 'connecting' && styles['toolbar__status-dot--connecting'],
		connectionStatus === 'error' && styles['toolbar__status-dot--error'],
		connectionStatus === 'idle' && styles['toolbar__status-dot--idle'],
	]
		.filter(Boolean)
		.join(' ');

	const isShared = sessionMode === 'shared';
	const sharingButtonLabel = isShared ? 'Stop Sharing' : 'Start Sharing';
	const sharingButtonDisabled = connectionStatus === 'connecting';

	const handleSharing = () => {
		if (isShared) {
			if (onStopSharing) {
				onStopSharing();
			} else {
				canvasState.stopSharing();
			}
		} else {
			if (onStartSharing) {
				onStartSharing();
			} else {
				console.log('Start sharing click handler is not provided');
			}
		}
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
			<div className={styles['toolbar__center']}>
				<div className={styles['toolbar__session']} aria-label="Session status">
					<div className={styles['toolbar__status']}>
						<span className={statusDotClassName} aria-hidden="true" />
						<span className={styles['toolbar__status-text']}>{statusLabel}</span>
					</div>
					<span className={styles['toolbar__mode']}>{modeLabel}</span>
					<button
						type="button"
						className={styles['toolbar__session-button']}
						onClick={handleSharing}
						disabled={sharingButtonDisabled}
					>
						{sharingButtonLabel}
					</button>
					{username && (
						<span className={styles['toolbar__username']} title={username}>
							{username}
						</span>
					)}
				</div>
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
