import { defineConfig, loadEnv } from 'vite'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/** Ensure every bundled @font-face uses font-display: swap (PageSpeed / Lighthouse). */
function enforceFontDisplaySwap(): Plugin {
  return {
    name: 'enforce-font-display-swap',
    apply: 'build',
    generateBundle(_options, bundle) {
      for (const file of Object.values(bundle)) {
        if (file.type !== 'asset' || !file.fileName.endsWith('.css')) continue;
        if (typeof file.source !== 'string') continue;
        file.source = file.source.replace(/@font-face\s*\{([^}]+)\}/gi, (block, body) => {
          if (/font-display\s*:/i.test(body)) {
            return block.replace(/font-display\s*:\s*[^;}+]+/gi, 'font-display: swap');
          }
          const trimmed = body.trim().replace(/;+\s*$/, '');
          return `@font-face { ${trimmed}; font-display: swap; }`;
        });
      }
    },
  };
}

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
            if (id.includes('lucide-react')) return 'icons';
            if (id.includes('node_modules/react-dom') || /node_modules\/react\//.test(id)) {
              return 'react-vendor';
            }
          },
        },
      },
      modulePreload: {
        resolveDependencies: (_filename, deps) =>
          deps.filter((d) => !d.includes('supabase') && !d.includes('icons')),
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
      ...(command === 'build' ? [enforceFontDisplaySwap(), nonBlockingMainCss()] : []),
    ],
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  }
})