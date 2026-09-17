import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: true, // Needed for docker
    watch: {
      usePolling: true, // Fixes file change detection on Windows Docker
    }
  }
})
