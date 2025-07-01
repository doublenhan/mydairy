import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  
  server: {
    hmr: true,
    watch: {
      usePolling: true,
      interval: 100,
    },
    open: false,
  },
  
  build: {
    sourcemap: true,
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['axios', 'jspdf', 'html2canvas']
        }
      }
    }
  },
  
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react'],
  },
  
  css: {
    devSourcemap: true,
  },
});