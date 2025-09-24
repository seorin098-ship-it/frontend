import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // 'global'을 'window'로 대체하여 브라우저 환경에서 작동하도록 설정
    global: 'window',
  },
})