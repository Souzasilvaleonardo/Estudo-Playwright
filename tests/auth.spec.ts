import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.saucedemo.com/';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('T1.1: Fazer login com standard_user', async ({ page }) => {
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    await page.click('[data-test="login-button"]');

    await expect(page).toHaveURL(/.*\/inventory\.html/);
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
  });

  test('T2.9: Login com credenciais inválidas', async ({ page }) => {
    await page.fill('[data-test="username"]', 'invalid_user');
    await page.fill('[data-test="password"]', 'wrong_password');
    await page.click('[data-test="login-button"]');

    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Username and password');
    await expect(page).toHaveURL(BASE_URL);
  });

  test('T2.10: Login com conta bloqueada (locked_out_user)', async ({ page }) => {
    await page.fill('[data-test="username"]', 'locked_out_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    await page.click('[data-test="login-button"]');

    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('locked out');
    await expect(page).toHaveURL(BASE_URL);
  });
});
