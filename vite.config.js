import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['kerala-psc-logo.jpg', 'icons/*.png'],
      manifest: {
        name: 'Kerala PSC Exam Practice',
        short_name: 'PSC Practice',
        description: 'Kerala PSC exam practice with PYQs, spaced repetition, mock exams and subject-wise quizzes',
        start_url: '/',
        display: 'standalone',
        background_color: '#0b1120',
        theme_color: '#0b1120',
        orientation: 'portrait-primary',
        scope: '/',
        lang: 'en',
        categories: ['education', 'productivity'],
        icons: [
          { src: '/icons/icon-72.png',  sizes: '72x72',   type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-96.png',  sizes: '96x96',   type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-128.png', sizes: '128x128', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-144.png', sizes: '144x144', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-152.png', sizes: '152x152', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
          { src: '/icons/icon-384.png', sizes: '384x384', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
        shortcuts: [
          {
            name: 'Quick Quiz',
            short_name: 'Quiz',
            description: 'Start a quick quiz session',
            url: '/?tab=quiz',
            icons: [{ src: '/icons/icon-96.png', sizes: '96x96' }],
          },
          {
            name: 'Bookmarks',
            short_name: 'Saved',
            description: 'View bookmarked questions',
            url: '/?tab=bookmarks',
            icons: [{ src: '/icons/icon-96.png', sizes: '96x96' }],
          },
        ],
      },
      workbox: {
        // Cache all HTML, JS, CSS
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,woff2}'],
        // Offline fallback
        navigateFallback: '/index.html',
        // Max cache size per entry: 5MB
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        runtimeCaching: [
          // Cache Google Fonts
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      devOptions: {
        enabled: false, // disable in dev to avoid confusion
      },
    }),
  ],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    chunkSizeWarningLimit: 3500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) return 'vendor';
          if (id.includes('pyq_2026_questions.json')) return 'pyq-2026';
          if (id.includes('pyq_2025_questions.json')) return 'pyq-2025';
          if (id.includes('pyq_2024_questions.json')) return 'pyq-2024';
          if (id.includes('pyq_2023_questions.json')) return 'pyq-2023';
          if (id.includes('pyq_2022_questions.json')) return 'pyq-2022';
          if (id.includes('pyq_2021_questions.json')) return 'pyq-2021';
          if (id.includes('malayalam_questions.json')) return 'data-malayalam';
          if (id.includes('english_questions.json')) return 'data-english';
        },
      },
    },
  },
});
