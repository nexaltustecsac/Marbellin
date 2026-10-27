import { defineConfig } from 'vite';

export default defineConfig({
  root: 'public/admin',
  publicDir: false,
  server: { host: '0.0.0.0' },
  build: {
    outDir: '../../public/build',
    emptyOutDir: true,
  },
});
