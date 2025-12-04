import styles from './app.module.scss';
import { Canvas } from '@widgets/canvas';
import { SettingsBar } from '@widgets/settings-bar';
import { ToolBar } from '@widgets/toolbar';

function App() {
	return (
		<div className={styles.app}>
			<ToolBar />
			<SettingsBar />
			<Canvas />
		</div>
	);
}

export default App;
