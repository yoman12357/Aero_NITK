import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Optimized code splitting (Firebase compatible)
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react')) {
              return 'vendor-react';
            }
            if (id.includes('gsap') || id.includes('motion')) {
              return 'vendor-animations';
            }
            if (id.includes('lucide') || id.includes('react-icons')) {
              return 'vendor-ui';
            }
            if (id.includes('router') || id.includes('helmet')) {
              return 'vendor-utils';
            }
            return 'vendor-misc';
          }
        }
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    sourcemap: false,
    cssCodeSplit: true,
    reportCompressedSize: false
  }
})
