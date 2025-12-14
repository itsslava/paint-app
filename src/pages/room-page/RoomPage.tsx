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

	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	const handleStartSharing = () => {
		if (!id) {
			console.log('No room id');
			return;
		}

		if (!canvasState.username.trim()) {
			setIsModalOpen(true);
			return;
		}

		canvasState.startSharing(id, canvasState.username);
	};

	const handleStopSharing = () => {
		canvasState.stopSharing();
	};

	const handleNameSubmit = (name: string) => {
		if (!id) {
			console.log('No room id');
			return;
		}

		canvasState.setUsername(name);
		canvasState.startSharing(id, name);
		setIsModalOpen(false);
	};

	useEffect(() => {
		if (id) {
			canvasState.setSessionId(id);
		}
		return () => {
			canvasState.stopSharing();
			canvasState.setSessionId(null);
		};
	}, [id]);

	return (
		<div className={styles.page}>
			<SessionNameModal isOpen={isModalOpen} onSubmit={handleNameSubmit} />
			<ToolBar onStartSharing={handleStartSharing} onStopSharing={handleStopSharing} />
			<SettingsBar />
			<Canvas />
		</div>
	);
};

export default RoomPage;
