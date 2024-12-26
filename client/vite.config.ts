import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { visualizer } from "rollup-plugin-visualizer";
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: {
      'process.env': JSON.stringify(env)
    },
    server: {
      proxy: {
        // with options: http://localhost:5173/api/bar-> http://jsonplaceholder.typicode.com/bar
        '/api': {
          target: 'https://trendingup.top/api',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      }
    } ,
    plugins: [
      react(),
      visualizer({ open: true }) // 自动开启分析页面
    ],
    resolve: {
      alias: {
        // @ 替代为 src
        // '@': resolve(__dirname, 'src'),
        // @component 替代为 src/component
        '@/components': resolve(__dirname, 'src/components'),
        '@/ui': resolve(__dirname, 'src/components/ui'),
        '@/store': resolve(__dirname, 'src/store'),
        '@/lib': resolve(__dirname, 'src/lib'),
        '@/styles': resolve(__dirname, 'src/styles'),
        '@/utils': resolve(__dirname, 'src/utils'),
        '@/types': resolve(__dirname, 'src/types'),
        '@/locales': resolve(__dirname, 'src/locales'),
        '@/hooks': resolve(__dirname, 'src/hooks'),
      },
    },
  }
})
