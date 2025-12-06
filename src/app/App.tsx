import styles from './app.module.scss';
import { Canvas } from '@widgets/canvas';
import { SettingsBar } from '@widgets/settings-bar';
import { ToolBar } from '@widgets/toolbar';
import { SessionNameModal } from '@features/session-name';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function App() {
	return (
		<BrowserRouter>
			<div className={styles.app}>
				<Routes>
					<Route
						path="/:id"
						element={
							<>
								<SessionNameModal isOpen={true} onSubmit={(name) => console.log(name)} />
								<ToolBar />
								<SettingsBar />
								<Canvas />
							</>
						}
					/>
					<Route path="*" element={<Navigate to={`/${(+new Date()).toString(16)}`} />} />
				</Routes>
			</div>
		</BrowserRouter>
	);
}

export default App;
