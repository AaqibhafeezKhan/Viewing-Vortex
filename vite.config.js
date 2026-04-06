import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png', 'icons/*.svg'],
      manifest: {
        name: 'Viewing Vortex',
        short_name: 'ViewVortex',
        description: 'Discover movies, TV shows, and books with Viewing Vortex',
        theme_color: '#1e3a8a',
        background_color: '#f9fafb',
        display: 'standalone',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.themoviedb\.org\/.*/i,
            handler: 'NetworkFirst',
            options: { cacheName: 'tmdb-api-cache', expiration: { maxEntries: 100, maxAgeSeconds: 300 } },
          },
          {
            urlPattern: /^https:\/\/image\.tmdb\.org\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'tmdb-image-cache', expiration: { maxEntries: 200, maxAgeSeconds: 86400 } },
          },
          {
            urlPattern: /^https:\/\/openlibrary\.org\/.*/i,
            handler: 'NetworkFirst',
            options: { cacheName: 'openlibrary-cache', expiration: { maxEntries: 50, maxAgeSeconds: 600 } },
          },
        ],
      },
    }),
  ],
  server: {
    port: 3000,
  },
});
