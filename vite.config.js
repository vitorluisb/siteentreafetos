import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import viteImagemin from 'vite-plugin-imagemin'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteImagemin({
      gifsicle: {
        optimizationLevel: 7,
        interlaced: false,
      },
      optipng: {
        optimizationLevel: 7,
      },
      mozjpeg: {
        quality: 80,
        progressive: true,
      },
      pngquant: {
        quality: [0.65, 0.8],
        speed: 4,
      },
      svgo: {
        plugins: [
          {
            name: 'removeViewBox',
          },
          {
            name: 'removeEmptyAttrs',
            active: false,
          },
        ],
      },
      webp: {
        quality: 80,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    chunkSizeWarningLimit: 1000,
    target: 'es2015',
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React core
          if (id.includes('react') && !id.includes('react-router') && !id.includes('react-icons') && !id.includes('react-leaflet') && !id.includes('react-dropzone') && !id.includes('react-hook-form')) {
            return 'react-core';
          }
          // Router
          if (id.includes('react-router')) {
            return 'router';
          }
          // UI Libraries
          if (id.includes('@chakra-ui') || id.includes('@emotion')) {
            return 'ui-chakra';
          }
          // Animation
          if (id.includes('framer-motion')) {
            return 'motion';
          }
          // Icons (split into smaller chunks)
          if (id.includes('react-icons')) {
            return 'icons-react';
          }
          if (id.includes('lucide-react')) {
            return 'icons-lucide';
          }
          // Maps (split into smaller chunks)
          if (id.includes('leaflet') || id.includes('react-leaflet')) {
            return 'maps-leaflet';
          }
          if (id.includes('@googlemaps')) {
            return 'maps-google';
          }
          // Supabase
          if (id.includes('@supabase')) {
            return 'supabase';
          }
          // Forms
          if (id.includes('react-hook-form') || id.includes('react-dropzone')) {
            return 'forms';
          }
          // Date utilities
          if (id.includes('date-fns')) {
            return 'date-utils';
          }
          // Other vendor libraries
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const extType = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/mp4|webm|ogg|mp3|wav|flac|aac/i.test(extType)) {
            return `assets/media/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
        passes: 2,
      },
      mangle: {
        safari10: true,
      },
      format: {
        comments: false,
      },
    },
  },
  server: {
    port: 3000,
    open: true,
    host: true,
  },
  preview: {
    port: 4173,
    open: true,
    host: true,
  },
})

