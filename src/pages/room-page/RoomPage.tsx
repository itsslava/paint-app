import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import styles from './room-page.module.scss';
import { Canvas } from '@widgets/canvas';
import { SettingsBar } from '@widgets/settings-bar';
import { ToolBar } from '@widgets/toolbar';
import { SessionNameModal } from '@features/session-name';
import canvasState from '@shared/store/canvasState';

const RoomPage = () => {
	const { id } = useParams<{ id: string }>();

	const [isModalOpen, setIsModalOpen] = useState<boolean>(true);
	const [username, setUsername] = useState<string>('');

	const handleNameSubmit = (name: string) => {
		setUsername(name);
		canvasState.setUsername(name);
		setIsModalOpen(false);
	};

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const drawHandler = (msg: any) => {
		console.log(msg);
	};

	useEffect(() => {
		if (!id || !username) return;

		const socket = new WebSocket('ws://localhost:5050/');
		console.log('trying to connect...');

		canvasState.setSocket(socket);
		canvasState.setSessionId(id);

		socket.onopen = () => {
			console.log('socket opened');
			socket.send(
				JSON.stringify({
					id: id,
					username: username,
					method: 'connection',
				})
			);
		};

		socket.onmessage = (event) => {
			const msg = JSON.parse(event.data);
			switch (msg.method) {
				case 'connection':
					console.log(`user ${msg.username} connected`);
					break;
				case 'draw':
					drawHandler(msg);
					break;
			}
			console.log('FROM SERVER:', msg);
		};

		socket.onerror = (event) => {
			console.log('WS ERROR:', event);
		};

		return () => {
			socket.close();
		};
	}, [id, username]);

	return (
		<div className={styles.page}>
			<SessionNameModal isOpen={isModalOpen} onSubmit={handleNameSubmit} />
			<ToolBar />
			<SettingsBar />
			<Canvas />
		</div>
	);
};

export default RoomPage;
