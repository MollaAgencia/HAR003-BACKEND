import swc from 'unplugin-swc'
import tsConfigPaths from 'vite-tsconfig-paths'
import { coverageConfigDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    root: './',
    exclude: ['./node_modules', './build'],
    include: ['./src/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'clover'],
      include: ['**/src/domain/**'],
      exclude: ['./node_modules', './build', ...coverageConfigDefaults.exclude],
    },
  },
  plugins: [
    tsConfigPaths(),
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
})
