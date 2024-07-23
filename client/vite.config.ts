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
        '@/utils': resolve(__dirname, 'src/utils'),
        '@/hooks': resolve(__dirname, 'src/hooks'),
      },
    },
  }
})
