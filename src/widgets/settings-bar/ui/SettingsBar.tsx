import toolState from '@shared/store/toolState';
import styles from './settings-bar.module.scss';

const SettingsBar = () => {
	return (
		<div className={styles.settingsbar} role="toolbar" aria-label="Settings tools">
			<div className={styles.settingsbar__group}>
				<label htmlFor="stroke-color">Цвет линии:</label>
				<input
					id="stroke-color"
					type="color"
					className={styles['settingsbar__color-input']}
					onChange={(e) => toolState.setStrokeColor(e.target.value)}
				/>
			</div>
			<div className={styles.settingsbar__group}>
				<label htmlFor="fill-color">Цвет заливки:</label>
				<input
					id="fill-color"
					type="color"
					className={styles['settingsbar__color-input']}
					onChange={(e) => toolState.setFillColor(e.target.value)}
				/>
			</div>
			<div className={styles.settingsbar__group}>
				<label htmlFor="stroke-width">Толщина линии:</label>
				<input
					id="stroke-width"
					type="number"
					min={1}
					max={50}
					defaultValue={1}
					className={styles['settingsbar__number-input']}
					onChange={(e) => toolState.setLineWidth(Number(e.target.value))}
				/>
			</div>
		</div>
	);
};

export default SettingsBar;
