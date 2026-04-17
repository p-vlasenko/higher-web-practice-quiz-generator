import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 5_000 },
    use: {
      baseURL: process.env.BASE_URL ?? 'http://127.0.0.1:3001',
      headless: true,
      viewport: { width: 1280, height: 720 },
      actionTimeout: 5_000,
    },
    ...(
      process.env.USE_LOCAL_SERVER === 'true'
        ? {
          webServer: {
            command: 'npm run dev',
            port: 3001,
            timeout: 120_000,
            reuseExistingServer: false,
          },
        }
        : {}
    ),
});
