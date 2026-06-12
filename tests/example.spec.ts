import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Swag Labs/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});

test('login com sucesso', async({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  
  // Preencha os campos e submeta o formulário
  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').fill('secret_sauce')
  await page.locator('[data-test="login-button"]').click();
  
  // Aguarde o carregamento e verifique se o login foi bem-sucedido
  await expect(page.locator('[data-test="title"]')).toBeVisible(); // Substitua pela URL/elemento pós-login

  // Salve o estado de autenticação
  await page.context().storageState({ path: 'storage/auth.json' });

});


