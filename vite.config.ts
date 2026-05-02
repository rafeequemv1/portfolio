import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    build: {
      target: 'es2022',
      sourcemap: true,
    },
    server: {
      host: true,
      port: 5173,
      strictPort: true,
    },
    plugins: [
      react(),
      tailwindcss(),
    ],
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  }
})