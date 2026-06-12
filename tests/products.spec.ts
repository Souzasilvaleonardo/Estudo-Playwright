import { test, expect } from '@playwright/test';

test.use({ storageState: 'storage/auth.json' });

const BASE_URL = 'https://www.saucedemo.com/';

test.describe('Products', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}inventory.html`);
    await expect(page).toHaveURL(/.*\/inventory\.html/);
  });

  test('T1.2: Exibir página de produtos após login', async ({ page }) => {
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
    await expect(page.locator('.inventory_item')).toHaveCount(6);
  });

  test('T2.1: Ordenar produtos por nome (A-Z)', async ({ page }) => {
    await page.selectOption('.product_sort_container', 'az');
    const names = await page.locator('.inventory_item_name').allTextContents();
    const sorted = [...names].sort();
    expect(names).toEqual(sorted);
  });

  test('T2.2: Ordenar produtos por nome (Z-A)', async ({ page }) => {
    await page.selectOption('.product_sort_container', 'za');
    const names = await page.locator('.inventory_item_name').allTextContents();
    const sorted = [...names].sort().reverse();
    expect(names).toEqual(sorted);
  });

  test('T2.3: Ordenar produtos por preço (menor)', async ({ page }) => {
    await page.selectOption('.product_sort_container', 'lohi');
    const prices = (await page.locator('.inventory_item_price').allTextContents())
      .map(text => parseFloat(text.replace('$', '')));
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  test('T2.4: Ordenar produtos por preço (maior)', async ({ page }) => {
    await page.selectOption('.product_sort_container', 'hilo');
    const prices = (await page.locator('.inventory_item_price').allTextContents())
      .map(text => parseFloat(text.replace('$', '')));
    const sorted = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sorted);
  });
});
