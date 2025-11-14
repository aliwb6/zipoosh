import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/zipoosh/', // نام repository
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})