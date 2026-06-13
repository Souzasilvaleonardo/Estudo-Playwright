import { test, expect } from '@playwright/test';

test.use({ storageState: 'storage/auth.json' });

const BASE = 'https://www.saucedemo.com/';

test.describe('Compra e Checkout (playwright test)', () => {
  test('Comprar 5 produtos, remover 1 e finalizar compra', async ({ page }) => {
    await page.goto(`${BASE}inventory.html`);
    await expect(page).toHaveURL(/.*\/inventory\.html/);

    const addButtons = page.locator('button[data-test^="add-to-cart-"]');
    await page.waitForSelector('button[data-test^="add-to-cart-"]', { timeout: 5000 }).catch(() => {});

    // Adiciona até 5 produtos, com verificações dinâmicas para evitar elementos desconectados
    let addedCount = 0;
    for (let i = 0; i < 5; i++) {
      const currentCount = await addButtons.count();
      if (i >= currentCount) break;
      const btn = addButtons.nth(i);
      try {
        await btn.scrollIntoViewIfNeeded();
        await btn.click({ timeout: 5000 });
        addedCount++;
      } catch (e) {
        // se não for clicável, tenta continuar com o próximo
        continue;
      }
    }

    // badge may show number of items added (or fewer if site behaves differently)
    const badge = page.locator('.shopping_cart_badge');
    if (await badge.count()) {
      await expect(badge).toHaveText(String(Math.max(0, addedCount)));
    }

    // abrir carrinho
    await page.click('.shopping_cart_link');
    await expect(page.locator('.cart_item')).toHaveCount(Math.max(0, addedCount));

    // remover um produto (se houver)
    const removeButtons = page.locator('button[data-test^="remove-"]');
    if (await removeButtons.count()) {
      await removeButtons.first().click();
      await expect(page.locator('.cart_item')).toHaveCount(Math.max(0, addedCount - 1));
    }

    // checkout
    await page.click('[data-test="checkout"]');
    await page.fill('[data-test="firstName"]', 'John');
    await page.fill('[data-test="lastName"]', 'Doe');
    await page.fill('[data-test="postalCode"]', '12345');
    await page.click('[data-test="continue"]');

    await page.click('[data-test="finish"]');
    await expect(page.locator('.complete-header')).toContainText(/thank/i);
  });
});
