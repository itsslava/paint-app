import { RoomPage } from '@pages/room-page';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/:id" element={<RoomPage />} />
				<Route path="*" element={<Navigate to={`/${(+new Date()).toString(16)}`} />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
