import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import styles from './room-page.module.scss';
import { Canvas } from '@widgets/canvas';
import { SettingsBar } from '@widgets/settings-bar';
import { ToolBar } from '@widgets/toolbar';
import { SessionNameModal } from '@features/session-name';
import canvasState from '@shared/store/canvasState';
import type { DrawMessage, WsMessage } from '@shared/types/drawing';
import { saveRoomImage } from '@shared/api/image';
import { applyFigureOnContext } from '@shared/lib';

// TODO - username in ui, using useState

const RoomPage = () => {
	const { id } = useParams<{ id: string }>();

	const [isModalOpen, setIsModalOpen] = useState<boolean>(true);
	const [socket, setSocket] = useState<WebSocket | null>(null);

	const drawHandler = (msg: DrawMessage) => {
		if (!msg.figure) return;

		const canvas = canvasState.canvas;
		if (!canvas) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		applyFigureOnContext(ctx, msg.figure);

		if (!id) return;

		const { type } = msg.figure;

		const shouldSave =
			type === 'finish' || type === 'rectangle' || type === 'circle' || type === 'line';

		if (shouldSave) {
			saveRoomImage(id, canvas);
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
