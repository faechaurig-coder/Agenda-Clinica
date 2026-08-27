import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
  preview: {
    host: true,
    port: 12000,
    allowedHosts: [
      'work-1-nbsymvilmzxcqitf.prod-runtime.all-hands.dev',
      'work-2-nbsymvilmzxcqitf.prod-runtime.all-hands.dev',
    ],
  },
})