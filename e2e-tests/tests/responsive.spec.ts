import { test, expect } from '@playwright/test';
import { url } from './utils';

test.describe('Responsive checks', () => {
  test('quizzes page fits mobile width', async ({ page }) => {
    // create a quiz then test responsive behavior
    await page.goto(url('/index.html'));
    await page.waitForSelector('#quiz-json-input');

    const payload = {
      title: 'Responsive Quiz',
      description: 'responsive',
      questions: [
        {
          id: 1,
          type: 'single',
          text: 'Q',
          options: [
            { id: 1, text: 'A', message: 'A', correct: true },
            { id: 2, text: 'B', message: 'B', correct: false }
          ]
        },
      ],
    };

    await page.fill('#quiz-json-input', JSON.stringify(payload));

    await Promise.all([
      page.waitForNavigation({ url: /.*quizzes.html/ }),
      page.click('.generator__button'),
    ]);

    // mobile viewport
    await page.setViewportSize({ width: 375, height: 800 });

    // ensure no horizontal overflow
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const innerWidth = await page.evaluate(() => window.innerWidth);
    expect(scrollWidth).toBeLessThanOrEqual(innerWidth);
  });
});
