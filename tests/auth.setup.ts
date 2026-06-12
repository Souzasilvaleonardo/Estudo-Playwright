import { test as setup, expect } from '@playwright/test';

setup('autenticar', async ({ page }) => {
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