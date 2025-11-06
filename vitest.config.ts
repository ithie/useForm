import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

/// <reference types="vitest" />

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        lines: 90,
        functions: 85,
        branches: 80,
        statements: 90
      },
      exclude: ['node_modules/', 'dist/', 'src/index.ts', '**/*.config.ts', '**/*.d.ts']
    }
  }
})
