const { test, expect } = require('@playwright/test');

const baseURL = 'https://ndgsp.gaipp.com/signin';

test.describe('Authentication Tests', () => {
  test('Testcase 1: Valid Login - Redirect to Dashboard', async ({ page }) => {
    // Go to signin page
    await page.goto(baseURL);

    // Enter email
    await page.fill('input[type="email"]', 'white@gmail.in');

    // Enter password
    await page.fill('input[type="password"]', '123456');

    // Click Login button
    await page.click('button[type="submit"]');

    // Verify redirect to dashboard
    await expect(page).toHaveURL('https://ndgsp.gaipp.com/crm/dashboard/summary');
  });

  test('Testcase 2: Invalid Login - Toast Message Verification', async ({ page }) => {
    // Go to signin page
    await page.goto(baseURL);

    // Enter email
    await page.fill('input[type="email"]', 'testsete@gmail.com');

    // Enter password
    await page.fill('input[type="password"]', '123456');

    // Click Login button
    await page.click('button[type="submit"]');

    // Verify toast message appears
    await expect(page.locator('text=You are not registered, please register now')).toBeVisible();
  });
});
