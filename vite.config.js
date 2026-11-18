import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Ensures assets load correctly on GitHub Pages under any subpath
  server: {
    port: 3000,
    host: true,
    allowedHosts: true
  }
});
