import { defineConfig, loadEnv } from 'vite'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/** Replace render-blocking <link rel="stylesheet"> with preload + onload (see web.dev/defer-non-critical-css). */
function nonBlockingMainCss(): Plugin {
  return {
    name: 'non-blocking-main-css',
    apply: 'build',
    transformIndexHtml(html) {
      return html.replace(
        /<link rel="stylesheet"( crossorigin)? href="(\/assets\/[^"]+\.css)">/g,
        (_match, crossorigin: string | undefined, href: string) => {
          const co = crossorigin ? ' crossorigin' : ''
          const blocking = `<link rel="stylesheet"${crossorigin || ''} href="${href}">`
          return (
            `<link rel="preload" href="${href}" as="style"${co} onload="this.onload=null;this.rel='stylesheet'">` +
            `<noscript>${blocking}</noscript>`
          )
        }
      )
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    build: {
      target: 'es2022',
      sourcemap: mode !== 'production',
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return;
            if (id.includes('@supabase')) return 'supabase';
            if (id.includes('node_modules/react-dom') || /node_modules\/react\//.test(id)) {
              return 'react-vendor';
            }
          },
        },
      },
    },
    server: {
      host: true,
      port: 5173,
      strictPort: true,
    },
    plugins: [
      react(),
      tailwindcss(),
      ...(command === 'build' ? [nonBlockingMainCss()] : []),
    ],
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  }
})