import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Development server configuration
  server: {
    // Enable hot module replacement
    hmr: true,
    // Watch for file changes
    watch: {
      usePolling: true,
      interval: 100,
    },
    // Auto open browser on start (optional)
    open: false,
    // Proxy configuration to fix CORS issues
    proxy: {
      '/api': {
        target: 'https://diaryjournal.vercel.app',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  },
  
  // Build configuration
  build: {
    // Enable source maps for better debugging
    sourcemap: true,
    // Watch mode for build (useful for development)
    watch: process.env.NODE_ENV === 'development' ? {} : null,
  },
  
  // Dependency optimization
  optimizeDeps: {
    exclude: ['lucide-react'],
    // Include common dependencies for faster dev startup
    include: ['react', 'react-dom'],
  },
  
  // Enable CSS hot reload
  css: {
    devSourcemap: true,
  },
});
