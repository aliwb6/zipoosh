import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/zipoosh/', // ⚠️ دقت کن / اول و آخر حتماً باشه
})