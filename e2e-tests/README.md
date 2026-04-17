Playwright E2E tests for the Quiz Generator

Setup

1. Install Playwright in the project (dev dependency):

```bash
npm i -D playwright @playwright/test
npx playwright install
```

Run tests (from project root):

```bash
npx playwright test --config=e2e-tests/playwright.config.ts
```

Tests are located in `e2e-tests/tests` and the Playwright config is `e2e-tests/playwright.config.ts`.
