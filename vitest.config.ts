import { defineConfig } from 'vitest/config';

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

export default defineConfig({
  test: {
    include: ['src/modules/**/*.int.spec.ts', 'src/modules/**/*.unit.spec.ts'],
  },
});
