import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import styles from './room-page.module.scss';
import { Canvas } from '@widgets/canvas';
import { SettingsBar } from '@widgets/settings-bar';
import { ToolBar } from '@widgets/toolbar';
import { SessionNameModal } from '@features/session-name';
import canvasState from '@shared/store/canvasState';
import { Brush, Rectangle, Line, Circle, Eraser } from '@shared/tools';
import type { DrawMessage, WsMessage } from '@shared/types/drawing';

// TODO - username in ui, using useState

const RoomPage = () => {
	const { id } = useParams<{ id: string }>();

	const [isModalOpen, setIsModalOpen] = useState<boolean>(true);
	const [socket, setSocket] = useState<WebSocket | null>(null);

	const drawHandler = (msg: DrawMessage) => {
		const { figure } = msg;
		const canvas = canvasState.canvas;
		if (!canvas) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		if (figure.strokeColor) {
			ctx.strokeStyle = figure.strokeColor;
		}
		if (figure.fillColor) {
			ctx.fillStyle = figure.fillColor;
		}
		if (typeof figure.lineWidth === 'number') {
			ctx.lineWidth = figure.lineWidth;
		}

		switch (figure.type) {
			case 'brush':
				Brush.draw(ctx, figure.x, figure.y);
				break;
			case 'eraser': {
				const prevOp = ctx.globalCompositeOperation;
				ctx.globalCompositeOperation = 'destination-out';

				if (typeof figure.lineWidth === 'number') {
					ctx.lineWidth = figure.lineWidth;
				}

				Eraser.draw(ctx, figure.x, figure.y);

				ctx.globalCompositeOperation = prevOp;
				break;
			}
			case 'rectangle': {
				const width = figure.w ?? 0;
				const height = figure.h ?? 0;
				Rectangle.draw(ctx, figure.x, figure.y, width, height);
				break;
			}
			case 'circle': {
				const radius = figure.r ?? 0;
				Circle.draw(ctx, figure.x, figure.y, radius);
				break;
			}
			case 'line': {
				const x2 = figure.x2 ?? figure.x;
				const y2 = figure.y2 ?? figure.y;
				Line.draw(ctx, figure.x, figure.y, x2, y2);
				break;
			}
			case 'finish':
				ctx.globalCompositeOperation = 'source-over';
				ctx.beginPath();
				break;
			default:
				console.log('Unknown figure type');
		}
	};

	const handleNameSubmit = (name: string) => {
		if (!id) {
			console.log('No room id');
			return;
		}

		canvasState.setUsername(name);
		setIsModalOpen(false);

		const ws = new WebSocket('ws://localhost:5050/');
		console.log('trying to connect...');

		setSocket(ws);
		canvasState.setSocket(ws);
		canvasState.setSessionId(id);

		ws.onopen = () => {
			console.log('socket opened');
			ws.send(
				JSON.stringify({
					id: id,
					username: name,
					method: 'connection',
				})
			);
		};

		ws.onmessage = (event) => {
			const msg: WsMessage = JSON.parse(event.data);
			switch (msg.method) {
				case 'connection':
					console.log(`user ${msg.username} connected`);
					break;
				case 'draw':
					drawHandler(msg);
					break;
				default:
					console.log('Unknown method');
			}
		};

		ws.onerror = (event) => {
			console.log('WS ERROR:', event);
		};
	};

	useEffect(() => {
		return () => {
			if (socket) {
				socket.close();
			}
		};
	}, [socket]);

	return (
		<div className={styles.page}>
			<SessionNameModal isOpen={isModalOpen} onSubmit={handleNameSubmit} />
			<ToolBar />
			<SettingsBar />
			<Canvas socket={socket} sessionId={id ?? null} />
		</div>
	);
};

export default RoomPage;
