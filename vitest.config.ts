import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

/**
 * Vitest Configuration
 * 
 * This configuration sets up the testing environment for the Vue 3 application.
 * It uses happy-dom as the test environment to provide browser-like APIs without
 * requiring a full browser, making tests faster and more reliable in CI/CD.
 */
export default defineConfig({
  // Vue plugin for processing .vue files during testing
  plugins: [vue()],
  
  test: {
    // Use happy-dom instead of jsdom for better performance and compatibility
    // happy-dom provides a more complete DOM implementation for Vue components
    environment: 'happy-dom',
    
    // Enable global test functions (describe, it, expect) without imports
    // This makes tests more concise and readable
    globals: true,
    
  },
});
