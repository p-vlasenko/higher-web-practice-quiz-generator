import { test, expect } from '@playwright/test';
import { url } from './utils';

test.describe('Quizzes page', () => {
  test('create quiz then delete it', async ({ page }) => {
    await page.goto(url('/index.html'));
    await page.waitForSelector('#quiz-json-input', { timeout: 30000 });

    const payload = {
      title: 'Delete Test Quiz',
      description: 'to be deleted',
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

    const card = page.locator('.quiz-card').first();
    await expect(card.locator('.quiz-card__title')).toContainText('Delete Test Quiz');

    // delete and assert removal
    await card.locator('.quiz-card__delete-button').click();
    await expect(page.locator('.quiz-card')).toHaveCount(0);
  });

  test('start quiz link navigates to quiz page', async ({ page }) => {
    await page.goto(url('/index.html'));
    await page.waitForSelector('#quiz-json-input', { timeout: 30000 });

    const payload = {
      title: 'Start Link Quiz',
      description: 'start link',
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

    const link = page.locator('.quiz-card__link').first();

    await Promise.all([
      page.waitForNavigation({ url: /.*quiz.html\?id=.*/ }),
      link.click(),
    ]);

    await expect(page.url()).toMatch(/quiz.html\?id=/);
  });
});
