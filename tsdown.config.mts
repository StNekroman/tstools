import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  platform: 'neutral',
  target: 'es2021',
  dts: true,
  // keeps "main" / "module" / "types" / "exports" in package.json in sync with the output
  exports: true,
  publint: true,
  attw: { profile: 'node16' },
});
