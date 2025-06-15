import { test, expect } from '@playwright/test';

// login with mock credentials
const email = 'folks@gmail.com';
const password = 'folks-password';

// ensure PUBLIC_API_MOCKING is enabled so MSW intercepts requests

test.beforeEach(async ({ page }) => {
  await page.goto('/login');
});

test('can log in and redirect to home', async ({ page }) => {
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.locator('form button[type=submit]').click();
  await expect(page).toHaveURL('/', { timeout: 10000 });
});

test('signup redirects to home', async ({ page }) => {
  await page.goto('/signup');
  await page.getByLabel('Email').fill('new@example.com');
  await page.getByLabel('Username').fill('newuser');
  await page.getByLabel('Password').fill('pw123');
  await page.locator('form button[type=submit]').click();
  await expect(page).toHaveURL('/');
});
