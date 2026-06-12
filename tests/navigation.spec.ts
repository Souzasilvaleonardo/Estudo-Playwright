import { test, expect } from '@playwright/test';

test.use({ storageState: 'storage/auth.json' });

const BASE_URL = 'https://www.saucedemo.com/';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}inventory.html`);
    await expect(page).toHaveURL(/.*\/inventory\.html/);
  });

  test('T2.8: Logout e voltar ao login', async ({ page }) => {
    await page.click('#react-burger-menu-btn');
    await expect(page.locator('#logout_sidebar_link')).toBeVisible();
    await page.click('#logout_sidebar_link');
    await expect(page).toHaveURL(BASE_URL);
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
    await expect(page.locator('[data-test="username"]')).toBeVisible();
    await expect(page.locator('[data-test="password"]')).toBeVisible();
  });
});
