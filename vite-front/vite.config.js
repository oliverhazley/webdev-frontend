// vite.config.js
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		rollupOptions: {
			input: {
				// List your html files here, e.g:
				main: resolve(__dirname, 'index.html'),
			},
		},
	},
	base: './',
});