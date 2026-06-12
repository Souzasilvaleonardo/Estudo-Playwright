import { test, expect } from '@playwright/test';

test.use({ storageState: 'storage/auth.json' });

const BASE_URL = 'https://www.saucedemo.com/';

test.describe('Checkout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}inventory.html`);
    await expect(page).toHaveURL(/.*\/inventory\.html/);
    await page.locator('button[data-test^="add-to-cart-"]').first().click();
  });

  test('T1.6: Proceder com checkout', async ({ page }) => {
    await page.click('.shopping_cart_link');
    await page.click('[data-test="checkout"]');
    await expect(page).toHaveURL(/.*\/checkout-step-one\.html/);
    await expect(page.locator('[data-test="firstName"]')).toBeVisible();
  });

  test('T1.7: Preencher dados de endereço', async ({ page }) => {
    await page.click('.shopping_cart_link');
    await page.click('[data-test="checkout"]');
    await page.fill('[data-test="firstName"]', 'John');
    await page.fill('[data-test="lastName"]', 'Doe');
    await page.fill('[data-test="postalCode"]', '12345');
    await page.click('[data-test="continue"]');
    await expect(page).toHaveURL(/.*\/checkout-step-two\.html/);
  });

  test('T1.8: Concluir compra', async ({ page }) => {
    await page.click('.shopping_cart_link');
    await page.click('[data-test="checkout"]');
    await page.fill('[data-test="firstName"]', 'John');
    await page.fill('[data-test="lastName"]', 'Doe');
    await page.fill('[data-test="postalCode"]', '12345');
    await page.click('[data-test="continue"]');
    await expect(page).toHaveURL(/.*\/checkout-step-two\.html/);
    await page.click('[data-test="finish"]');
    await expect(page).toHaveURL(/.*\/checkout-complete\.html/);
    await expect(page.locator('.complete-header')).toContainText('Thank you for your order');
    await expect(page.locator('.pony_express')).toBeVisible();
  });
});
