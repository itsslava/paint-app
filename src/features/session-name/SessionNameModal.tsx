import { useState } from 'react';
import styles from './session-name-modal.module.scss';

interface Props {
	isOpen: boolean;
	onSubmit: (name: string) => void;
}

const SessionNameModal = ({ isOpen, onSubmit }: Props) => {
	const [name, setName] = useState('');

	if (!isOpen) return null;

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const trimmed = name.trim();
		if (!trimmed) return;

		onSubmit(trimmed);
	};
	return (
		<div className={styles.backdrop}>
			<div className={styles.modal}>
				<h2 className={styles.title}>Введите имя пользователя:</h2>
				<form className={styles.form} action="submit" onSubmit={handleSubmit}>
					<input
						className={styles.input}
						type="text"
						placeholder="Имя"
						onChange={(e) => setName(e.target.value)}
					/>
					<button className={styles.submitBtn} type="submit" disabled={!name.trim()}>
						Продолжить
					</button>
				</form>
			</div>
		</div>
	);
};

export default SessionNameModal;
