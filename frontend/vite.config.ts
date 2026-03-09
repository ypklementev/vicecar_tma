import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import analyzer from "vite-bundle-analyzer";
import path from "path";


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), analyzer()],
  css: {
    preprocessorOptions: {
      sass: {
        additionalData: '',
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})