import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/modules/**/*.unit.spec.ts'],
  },
});
