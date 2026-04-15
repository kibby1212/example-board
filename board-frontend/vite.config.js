import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Tailwind v4 플러그인
  ],
  resolve: {
    alias: {
      // @ 기호를 src 폴더로 인식하게 해주는 설정
      "@": path.resolve(__dirname, "./src"),
    },
  },
})