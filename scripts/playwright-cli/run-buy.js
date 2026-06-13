async page => {
  const BASE = 'https://www.saucedemo.com/';
  await page.goto(BASE + 'inventory.html');
  await page.waitForLoadState('domcontentloaded');

  let add = page.locator('button[data-test^="add-to-cart-"]');
  let n = Math.min(5, await add.count());
  if (n === 0) {
    // try login flow
    await page.goto(BASE);
    if (await page.locator('[data-test="username"]').count()) {
      await page.fill('[data-test="username"]', 'standard_user');
      await page.fill('[data-test="password"]', 'secret_sauce');
      await page.click('[data-test="login-button"]');
      try { await page.waitForURL(/.*inventory\.html/, { timeout: 5000 }); } catch(e) {}
    }
    add = page.locator('button[data-test^="add-to-cart-"]');
    n = Math.min(5, await add.count());
  }

  for (let i = 0; i < n; i++) {
    try {
      const total = await add.count();
      if (i >= total) break;
      await add.nth(i).scrollIntoViewIfNeeded();
      await add.nth(i).click({ timeout: 5000 });
    } catch (e) {
      // skip if an item can't be clicked
      continue;
    }
  }

  const badge = await page.locator('.shopping_cart_badge').textContent().catch(()=>null);

  await page.click('.shopping_cart_link');
  await page.locator('button[data-test^="remove-"]').first().click().catch(()=>{});
  await page.click('[data-test="checkout"]');
  await page.fill('[data-test="firstName"]', 'John');
  await page.fill('[data-test="lastName"]', 'Doe');
  await page.fill('[data-test="postalCode"]', '12345');
  await page.click('[data-test="continue"]');
  await page.click('[data-test="finish"]');
  const complete = await page.locator('.complete-header').textContent().catch(()=>null);
  return { added: n, badge, complete };
}
