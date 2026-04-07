import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    base: './',
    server: {
        port: 3025,
        open: false,
    },
    build: {
        outDir: 'build',
    },
});