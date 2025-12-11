import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'@app': path.resolve(__dirname, 'src/app'),
			'@widgets': path.resolve(__dirname, 'src/widgets'),
			'@shared': path.resolve(__dirname, 'src/shared'),
			'@icons': path.resolve(__dirname, 'src/shared/icons'),
			'@styles': path.resolve(__dirname, 'src/shared/styles'),
			'@features': path.resolve(__dirname, 'src/features'),
			'@pages': path.resolve(__dirname, 'src/pages'),
		},
	},
});
