import { test, expect } from '@playwright/test';

test('home page displays navbar brand', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Folks')).toBeVisible();
});
