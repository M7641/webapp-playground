import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// @ts-expect-error Not able to find types for vite-plugin-eslint
import eslint from 'vite-plugin-eslint'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5050",
        secure: false,
      },
    },
  },
  plugins: [
    react(),
    eslint(
      {
        cache: false,
        include: ["./src/**/*.ts", "./src/**/*.tsx"],
        exclude: ["node_modules", "dist", "build", "public"],
      }
    ),
  ],
});