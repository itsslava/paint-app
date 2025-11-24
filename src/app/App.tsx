import styles from './app.module.scss';
import { Canvas } from '@widgets/canvas';
import { ToolBar } from '@widgets/toolbar';

function App() {
	return (
		<div className={styles.app}>
			<ToolBar />
			<Canvas />
		</div>
	);
}

export default App;
