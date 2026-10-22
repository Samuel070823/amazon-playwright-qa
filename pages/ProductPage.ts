
import { Page, Locator, expect } from '@playwright/test';

export class ProductPage {
  readonly page: Page;
  readonly productTitle: Locator;
  readonly addToCartButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productTitle = page.locator('#productTitle');
    this.addToCartButton = page.locator('#add-to-cart-button');
  }

  async getProductTitle(): Promise<string> {
    await expect(this.productTitle).toBeVisible();
    return (await this.productTitle.textContent())?.trim() ?? '';
  }

  async addToCart() {
    await expect(this.addToCartButton).toBeVisible();
    await this.addToCartButton.click();
  }

  

async expectAddedToCart() {
  await expect(this.page).toHaveURL(/\/cart\/smart-wagon/);

  await expect(
    this.page.getByText('Added to basket', { exact: true })
  ).toBeVisible();

  await expect(this.page.locator('#nav-cart-count')).toHaveText('1');
}
}