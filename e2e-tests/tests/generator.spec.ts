import { test, expect } from '@playwright/test';
import { url } from './utils';

test.describe('Generator page', () => {
  test('valid JSON generates quiz and navigates to quizzes', async ({ page }) => {
    await page.goto(url('/index.html'));
    await page.waitForSelector('#quiz-json-input', { timeout: 30000 });

    const payload = {
      title: 'E2E Test Quiz',
      description: 'E2E description',
      questions: [
        {
          id: 1,
          type: 'single',
          text: 'Question 1',
          options: [
            { id: 1, text: 'Answer', message: 'Correct', correct: true },
            { id: 2, text: 'Wrong', message: 'Incorrect', correct: false }
          ],
        },
      ],
    };

    await page.fill('#quiz-json-input', JSON.stringify(payload));

    await Promise.all([
      page.waitForNavigation({ url: /.*quizzes.html/ }),
      page.click('.generator__button'),
    ]);

    await expect(page).toHaveURL(/.*quizzes.html/);
    await expect(page.locator('.quiz-card')).toHaveCount(1);
    await expect(page.locator('.quiz-card__title')).toContainText('E2E Test Quiz');
    await expect(page.locator('.quiz-card__count')).toContainText('1');
  });

  test('invalid JSON shows error modal', async ({ page }) => {
    await page.goto(url('/index.html'));
    await page.waitForSelector('#quiz-json-input', { timeout: 30000 });
    await page.fill('#quiz-json-input', 'not a json');
    await page.click('.generator__button');
    await expect(page.locator('.modal_error')).toBeVisible();
    await expect(page.locator('.modal_error .error__title')).toContainText('Ошибка');
  });
});
