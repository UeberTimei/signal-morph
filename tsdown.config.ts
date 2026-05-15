import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['projects/signal-morph/src/public-api.ts'],
  format: ['esm'],
  dts: {
    build: true,
  },
  clean: true,
  outDir: 'dist/signal-morph',
  deps: {
    neverBundle: [/^\@angular\//, 'rxjs', 'tslib'],
  },
});
