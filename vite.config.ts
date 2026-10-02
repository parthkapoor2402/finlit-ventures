import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { sipCheckApiPlugin } from './src/server/sip-check-plugin.ts'

export default defineConfig({
  plugins: [react(), tailwindcss(), sipCheckApiPlugin()],
})
