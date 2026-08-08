import { defineConfig } from 'vitest/config';
import path from 'node:path';

/**
 * Unit configuration.
 *
 * Node environment, not jsdom: nothing here renders a component. These tests
 * cover the data and the generators, which is where a silent wrong answer
 * costs the most, and which needs no DOM at all.
 */
export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/unit/**/*.test.ts'],
  },
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, 'src') },
  },
});
