import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // The API's CORS policy allows http://localhost:5173, so always use this
    // port (fail instead of silently switching to another one).
    port: 5173,
    strictPort: true,
  },
})
