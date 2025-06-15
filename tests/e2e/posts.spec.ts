import { test, expect } from '@playwright/test';

// check that clicking a post navigates to detail page

test('navigate from home to post detail', async ({ page }) => {
  await page.goto('/');
  // click first post card
  await page.locator('div[style*=\"post-\"] img').first().click();
  await expect(page).toHaveURL(/\/posts\/\d+/);
});
