import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/app/',
  build: {
    outDir: '../public/app',
    emptyOutDir: true
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
      '/public': 'http://localhost:3000',
      '/uploads': 'http://localhost:3000',
      '/imagens': 'http://localhost:3000'
    }
  }
});
