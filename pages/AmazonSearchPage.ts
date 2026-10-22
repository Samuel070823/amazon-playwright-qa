
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
  const response = await this.page.goto('/', {
    waitUntil: 'domcontentloaded',
    timeout: 45000,
  });

  const title = await this.page.title();
  const bodyText = await this.page
    .locator('body')
    .innerText()
    .catch(() => '');

  console.log('Amazon URL:', this.page.url());
  console.log('HTTP status:', response?.status() ?? 'Sin respuesta');
  console.log('Page title:', JSON.stringify(title));
  console.log('Body text:', JSON.stringify(bodyText.slice(0, 300)));

  if (!response) {
    throw new Error('Amazon navigation returned no HTTP response.');
  }

  if (response.status() === 202 && !bodyText.trim()) {
    throw new Error(
      'Amazon returned HTTP 202 with an empty page. ' +
      'The test cannot continue until a usable page is available.'
    );
  }

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
