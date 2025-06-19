import { test, expect } from '@playwright/test';

test('home page has dynamic title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Home - Stylefolks');
});

test('login page has dynamic title', async ({ page }) => {
  await page.goto('/login');
  await expect(page).toHaveTitle('Login - Stylefolks');
});
