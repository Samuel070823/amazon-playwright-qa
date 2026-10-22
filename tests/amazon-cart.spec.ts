
import { test, expect } from '@playwright/test';
import { AmazonSearchPage } from '../pages/AmazonSearchPage';
import { ProductPage } from '../pages/ProductPage';

test('search for sofas and add the third result to the cart', async ({ page }) => {
  const searchPage = new AmazonSearchPage(page);
  const productPage = new ProductPage(page);

  await searchPage.goto();
  await searchPage.searchProduct('sofas');
  await searchPage.selectProduct(2);

  const title = await productPage.getProductTitle();
  expect(title).not.toBe('');

  console.log('Selected product:', title);

  await productPage.addToCart();
  await productPage.expectAddedToCart();

  console.log('Product successfully added to cart');
});
