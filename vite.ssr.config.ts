import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  build: {
    ssr: true,
    outDir: 'dist/server',
    rollupOptions: { input: './src/entry-server.tsx' },
    emptyOutDir: false,
  },
});
