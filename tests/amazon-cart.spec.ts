
import { test, expect } from '@playwright/test';

test('search for sofas and add the third result to the cart', async ({ page }) => {
  await page.goto('/');

  // Accept cookies if the banner appears
  
const acceptCookies = page.locator('#sp-cc-accept');
const declineCookies = page.getByRole('button', { name: /decline/i });

if (await acceptCookies.isVisible().catch(() => false)) {
  await acceptCookies.click();
} else if (await declineCookies.isVisible().catch(() => false)) {
  await declineCookies.click();
}


  // Search for sofas
  const searchBox = page.locator('#twotabsearchtextbox');
  await searchBox.fill('sofas');
  await searchBox.press('Enter');
  await page.waitForTimeout(2000);


  // Locate search results
  
const results = page.locator('[data-component-type="s-search-result"]');
const products = results.filter({
  has: page.locator('a[href*="/dp/"]'),
});

await expect(products.nth(2)).toBeVisible();

const thirdProduct = products.nth(2);
const productLink = thirdProduct.locator('a[href*="/dp/"]').first();

await expect(productLink).toBeVisible();

const productTitle = (await thirdProduct.innerText()).trim();
await productLink.click();



  // Add product to cart
  const addToCartButton = page.getByRole('button', {
  name: /add to basket|añadir a la cesta/i,
}).first();

await expect(addToCartButton).toBeVisible();
await addToCartButton.click();

await expect(
  page.locator('#nav-cart-count')
).not.toHaveText('0');

console.log('Producto añadido al carrito correctamente');
});
