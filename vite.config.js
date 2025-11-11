import {fileURLToPath, URL} from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import {defineConfig} from 'vite'

export default defineConfig(({mode}) => {
  // const env = loadEnv(mode, process.cwd(), '')
  // const {VITE_APP_ENV} = env
  return {
    plugins: [
      vue(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      port: 5173,
      open: true,
      // proxy: {
      //   '/api': {
      //     target: env.VITE_API_BASE || 'http://localhost:3000',
      //     changeOrigin: true,
      //     rewrite: p => p.replace(/^\/api/, ''),
      //   },
      // },
    },
    build: {
      sourcemap: mode === 'development',
      rollupOptions: {
        output: {
          manualChunks: {
            vue: ['vue', 'vue-router', 'pinia'],
            ui: ['element-plus', '@element-plus/icons-vue'],
          },
        },
      },
    },
    define: {
      __APP_VERSION__: JSON.stringify('0.0.0'),
    },
  }
})
