
import { Page, Locator, expect } from '@playwright/test';

export class AmazonSearchPage {
  readonly page: Page;
  readonly searchBox: Locator;
  readonly productResults: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchBox = page.locator('#twotabsearchtextbox');
    this.productResults = page.locator(
      '[data-component-type="s-search-result"]'
    );
  }

  async goto() {
    await this.page.goto('/');
  }

  async searchProduct(productName: string) {
    await expect(this.searchBox).toBeVisible();
    await this.searchBox.fill(productName);
    await this.searchBox.press('Enter');
  }

  

async selectProduct(index: number) {
  const product = this.productResults.nth(index);

  await expect(product).toBeVisible();

  // Buscar el enlace principal del título del producto.
  const productLink = product.locator('a:has(h2)');
await expect(productLink.first()).toBeVisible();
await productLink.first().click();
}
}
