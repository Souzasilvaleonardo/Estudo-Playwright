---
name: playwright-cli
description: Automate browser interactions, test web pages and work with Playwright tests.
allowed-tools: Bash(playwright-cli:*) Bash(npx:*) Bash(npm:*)
---

# Browser Automation with playwright-cli

(Resumo do comando e exemplo de uso localizado.)

## Exemplo prático: comprar 5 produtos, remover 1 e finalizar

Use a sequência abaixo para executar o cenário usando uma sessão persistente `buy` e o estado de autenticação salvo em `storage/auth.json`.

```bash
npx playwright-cli -s=buy open --browser=chrome --persistent https://www.saucedemo.com/inventory.html
npx playwright-cli -s=buy state-load storage/auth.json
npx playwright-cli -s=buy run-code 'async page => { const add = page.locator("button[data-test^=\"add-to-cart-\"]"); const n = Math.min(5, await add.count()); for (let i=0;i<n;i++) await add.nth(i).click(); return `added:${n}`; }' --raw
npx playwright-cli -s=buy click ".shopping_cart_link"
npx playwright-cli -s=buy run-code 'async page => { const btn = page.locator("button[data-test^=\"remove-\"]").first(); if (await btn.count()) await btn.click(); }'
npx playwright-cli -s=buy click "[data-test=\"checkout\"]"
npx playwright-cli -s=buy fill "[data-test=\"firstName\"]" "John"
npx playwright-cli -s=buy fill "[data-test=\"lastName\"]" "Doe"
npx playwright-cli -s=buy fill "[data-test=\"postalCode\"]" "12345"
npx playwright-cli -s=buy click "[data-test=\"continue\"]"
npx playwright-cli -s=buy click "[data-test=\"finish\"]"
npx playwright-cli -s=buy run-code 'async page => (await page.locator(".complete-header").textContent()) || "no-complete-text"' --raw
npx playwright-cli -s=buy close
```

Cole estes comandos no terminal (usa `npx playwright-cli` por padrão) ou salve-os como um script para execução direta.
