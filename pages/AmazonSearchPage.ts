
import { Page, Locator, expect } from '@playwright/test';

export class AmazonSearchPage {
  readonly page: Page;
  readonly searchBox: Locator;
  readonly productResults: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchBox = page.locator('#twotabsearchtextbox');
    this.productResults = page.locator(
      '[data-component-type="s-search-result"]'
    );
    this.continueShoppingButton = page.getByRole('button', {
      name: 'Seguir comprando',
      exact: true,
    });
  }

  async goto() {
    await this.page.goto('/');

    console.log('Amazon URL:', this.page.url());
    console.log('Amazon title:', await this.page.title());

    await this.reportUnexpectedPage();
  }

  async reportUnexpectedPage() {
    const isSearchVisible = await this.searchBox
      .isVisible()
      .catch(() => false);

    if (isSearchVisible) {
      return;
    }

    const isContinueShoppingVisible =
      await this.continueShoppingButton
        .isVisible()
        .catch(() => false);

    if (isContinueShoppingVisible) {
      throw new Error(
        'Amazon displayed the intermediate "Seguir comprando" page. ' +
        'The search flow cannot continue in the current page state.'
      );
    }

    throw new Error(
      `Unexpected Amazon page. URL: ${this.page.url()}; ` +
      `title: ${await this.page.title()}`
    );
  }

  async searchProduct(productName: string) {
    await expect(this.searchBox).toBeVisible({ timeout: 10000 });
    await this.searchBox.fill(productName);
    await this.searchBox.press('Enter');
  }

  async selectProduct(index: number) {
    const product = this.productResults.nth(index);

    await expect(product).toBeVisible();

    const productLink = product.locator('a:has(h2)');
    await expect(productLink.first()).toBeVisible();
    await productLink.first().click();
  }
}
