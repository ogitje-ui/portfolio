import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Flitser Alert',
        short_name: 'Flitser Alert',
        description: 'Free, open-source speed camera warnings from OpenStreetMap data.',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: '/icons/maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
        runtimeCaching: [
          {
            // OpenStreetMap tiles: cache aggressively so the map still
            // renders (from wherever the user has driven before) offline.
            urlPattern: /^https:\/\/[abc]\.tile\.openstreetmap\.org\/.*/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'osm-tiles',
              expiration: { maxEntries: 4000, maxAgeSeconds: 30 * 24 * 3600 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Overpass camera queries: prefer network, fall back to the
            // last successful response when offline (the app also keeps
            // its own IndexedDB cache independent of this).
            urlPattern: /^https:\/\/overpass.*\/api\/interpreter.*/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'overpass-api',
              networkTimeoutSeconds: 10,
              expiration: { maxEntries: 20, maxAgeSeconds: 24 * 3600 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
});
