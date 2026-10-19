import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    chunkSizeWarningLimit: 3500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          if (id.includes('pyq_2026_questions.json')) return 'pyq-2026';
          if (id.includes('pyq_2025_questions.json')) return 'pyq-2025';
          if (id.includes('pyq_2024_questions.json')) return 'pyq-2024';
          if (id.includes('pyq_2023_questions.json')) return 'pyq-2023';
          if (id.includes('pyq_2022_questions.json')) return 'pyq-2022';
          if (id.includes('pyq_2021_questions.json')) return 'pyq-2021';
          if (id.includes('malayalam_questions.json')) return 'data-malayalam';
          if (id.includes('english_questions.json')) return 'data-english';
        }
      }
    }
  }
});
