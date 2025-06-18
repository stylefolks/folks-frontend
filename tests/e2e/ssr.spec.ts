import { test, expect } from '@playwright/test';

test('directly navigating to a post works after reload', async ({ page }) => {
  await page.goto('/post/1');
  await expect(page.getByRole('heading', { name: 'Post title 1' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Post title 1' })).toBeVisible();
});

test('directly navigating to a crew page works', async ({ page }) => {
  await page.goto('/crew/alpha');
  await expect(page.getByRole('heading', { name: 'Crew alpha' })).toBeVisible();
});

test('directly navigating to a brand page works', async ({ page }) => {
  await page.goto('/brand/bravo');
  await expect(page.getByRole('heading', { name: 'Brand bravo' })).toBeVisible();
});
