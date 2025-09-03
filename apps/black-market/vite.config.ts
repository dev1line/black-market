/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import path from 'path';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/black-market',

  server: {
    port: 4200,
    // host: process.env.VITE_ALLOWED_HOSTS
    //   ? 'fast-feline-grand.ngrok-free.app'
    //   : '127.0.0.1',
    allowedHosts: ['fast-feline-grand.ngrok-free.app'],
  },

  preview: {
    port: 4300,
    host: '127.0.0.1',
  },

  plugins: [react(), nxViteTsPaths()],

  define: {
    'process.env': {},
  },

  build: {
    // ⚠️ Quan trọng: build ra thư mục dist ở ROOT
    outDir: path.resolve(__dirname, '../../dist/apps/black-market'),

    emptyOutDir: true,
    reportCompressedSize: true,
    sourcemap: true,
    rollupOptions: {
      external: [],
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});
