import { test, expect } from '@playwright/test';

test.use({ storageState: 'storage/auth.json' });

const BASE_URL = 'https://www.saucedemo.com/';

test.describe('Shopping Cart', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}inventory.html`);
    await expect(page).toHaveURL(/.*\/inventory\.html/);
  });

  test('T1.3: Adicionar um produto ao carrinho', async ({ page }) => {
    await page.locator('button[data-test^="add-to-cart-"]').first().click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('T1.4: Abrir carrinho e validar produto', async ({ page }) => {
    await page.locator('button[data-test^="add-to-cart-"]').first().click();
    await page.click('.shopping_cart_link');
    await expect(page).toHaveURL(/.*\/cart\.html/);
    await expect(page.locator('.cart_item')).toHaveCount(1);
    await expect(page.locator('.cart_item .inventory_item_name')).toBeVisible();
  });

  test('T1.5: Validar preço total do carrinho', async ({ page }) => {
    const addButtons = page.locator('button[data-test^="add-to-cart-"]');
    await addButtons.nth(0).click();
    await addButtons.nth(1).click();
    await page.click('.shopping_cart_link');
    await page.click('[data-test="checkout"]');
    await page.fill('[data-test="firstName"]', 'John');
    await page.fill('[data-test="lastName"]', 'Doe');
    await page.fill('[data-test="postalCode"]', '12345');
    await page.click('[data-test="continue"]');

    const itemPrices = (await page.locator('.inventory_item_price').allTextContents())
      .map(text => parseFloat(text.replace('$', '')));
    const expectedSubtotal = itemPrices.reduce((sum, value) => sum + value, 0);
    const subtotalText = await page.locator('.summary_subtotal_label').textContent();
    const subtotal = parseFloat(subtotalText?.replace(/[^0-9.]/g, '') ?? '0');
    expect(subtotal).toBeCloseTo(expectedSubtotal, 2);
    await expect(page.locator('.summary_total_label')).toContainText('Total');
  });

  test('T2.5: Adicionar múltiplos produtos ao carrinho', async ({ page }) => {
    const addButtons = page.locator('button[data-test^="add-to-cart-"]');
    await addButtons.nth(0).click();
    await addButtons.nth(1).click();
    await addButtons.nth(2).click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('3');
    await page.click('.shopping_cart_link');
    await expect(page.locator('.cart_item')).toHaveCount(3);
  });

  test('T2.6: Remover produto do carrinho', async ({ page }) => {
    const addButtons = page.locator('button[data-test^="add-to-cart-"]');
    await addButtons.nth(0).click();
    await addButtons.nth(1).click();
    await page.click('.shopping_cart_link');
    await expect(page.locator('.cart_item')).toHaveCount(2);
    await page.locator('button[data-test^="remove-"]').first().click();
    await expect(page.locator('.cart_item')).toHaveCount(1);
  });

  test('T2.7: Validar quantidade no carrinho', async ({ page }) => {
    const addButtons = page.locator('button[data-test^="add-to-cart-"]');
    await addButtons.nth(0).click();
    await addButtons.nth(1).click();
    await addButtons.nth(2).click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('3');
    await page.click('.shopping_cart_link');
    await expect(page.locator('.cart_item')).toHaveCount(3);
  });
});
