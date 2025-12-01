import { test, expect } from '@playwright/test';

const BASE_URL = 'https://react-shopping-cart-67954.firebaseapp.com';

test.describe('Shopping Cart Test Suite', () => {

  // ------------------------------  
  // Test Case 1: Add a Product to Cart  
  // ------------------------------
  test('Add a Product to Cart', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');

      const product = page.locator('.sc-124al1g-2', { hasText: 'Cropped Stay Groovy off white' }).first();
      await product.scrollIntoViewIfNeeded();
      await expect(product).toBeVisible();

      const addBtn = product.locator('button:has-text("Add to cart")').first();
      await addBtn.click();

      const cartPanel = page.locator('.sc-1h98xa9-0');
      await expect(cartPanel).toBeVisible();
      await expect(cartPanel.getByText('Cropped Stay Groovy off white')).toBeVisible();
      await expect(cartPanel.getByText('$10.90')).toBeVisible();
    });

  // ------------------------------  
  // Test Case 2: Increase Product Quantity  
  // ------------------------------
  test('Increase Product Quantity', async ({ page }) => {
    await page.goto(BASE_URL);

    await page.getByRole('button', { name: /add to cart/i }).first().click();
    const cartPanel = page.locator('.sc-1h98xa9-0');
    await expect(cartPanel).toBeVisible();

    // Try multiple locators for the plus button inside cart
    let plusButton = cartPanel.locator('button:has-text("+")');
    if (await plusButton.count() === 0) {
      plusButton = cartPanel.locator('button[aria-label="Add one"]');
    }
    await expect(plusButton.first()).toBeVisible();
    await plusButton.first().click();

    const qty = await cartPanel.locator('.sc-11uohgb-4').first().innerText();
    expect(Number(qty)).toBe(2);
  });

  // ------------------------------  
  // Test Case 3: Decrease Product Quantity  
  // ------------------------------
  test('Decrease Product Quantity', async ({ page }) => {
    await page.goto(BASE_URL);

    await page.getByRole('button', { name: /add to cart/i }).first().click();
    const cartPanel = page.locator('.sc-1h98xa9-0');
    await expect(cartPanel).toBeVisible();

    let plusButton = cartPanel.locator('button:has-text("+")');
    if (await plusButton.count() === 0) {
      plusButton = cartPanel.locator('button[aria-label="Add one"]');
    }
    await plusButton.first().click(); // Qty becomes 2

    let minusButton = cartPanel.locator('button:has-text("-")');
    if (await minusButton.count() === 0) {
      minusButton = cartPanel.locator('button[aria-label="Remove one"]');
    }
    await minusButton.first().click();

    const qty = await cartPanel.locator('.sc-11uohgb-4').first().innerText();
    expect(Number(qty)).toBe(1);
  });

  // ------------------------------  
  // Test Case 4: Remove Product from Cart  
  // ------------------------------
  test('Remove Product from Cart', async ({ page }) => {
    await page.goto(BASE_URL);

    await page.getByRole('button', { name: /add to cart/i }).first().click();

    const cartPanel = page.locator('.sc-1h98xa9-0');
    await expect(cartPanel).toBeVisible();
    let removeBtn = cartPanel.locator('button:has-text("×")');
    if (await removeBtn.count() === 0) {
      removeBtn = cartPanel.locator('button[aria-label="Remove"]');
    }
    await removeBtn.first().click();
    await expect(cartPanel.locator('.sc-1h98xa9-3')).toHaveCount(0);
  });

  // ------------------------------  
  // Test Case 5: Verify Subtotal  
  // ------------------------------
  test('Verify Subtotal Calculation', async ({ page }) => {
    await page.goto(BASE_URL);

    await page.getByText('Cropped Stay Groovy off white').scrollIntoViewIfNeeded();
    await page.locator('text=Cropped Stay Groovy off white')
      .locator('xpath=..')
      .locator('xpath=..')
      .getByRole('button', { name: 'Add to cart' })
      .click();

    await page.getByText('Basic Cactus White T-shirt').scrollIntoViewIfNeeded();
    await page.locator('text=Basic Cactus White T-shirt')
      .locator('xpath=..')
      .locator('xpath=..')
      .getByRole('button', { name: 'Add to cart' })
      .click();

    const cartPanel = page.locator('.sc-1h98xa9-0');
    await expect(cartPanel).toBeVisible();
    const subtotal = await cartPanel.locator('.sc-1h98xa9-6').innerText();
    expect(subtotal).toContain('24.15');
  });

  // ------------------------------  
  // Test Case 6: Filter Products by Size  
  // ------------------------------
  test('Filter Products by Size M', async ({ page }) => {
    await page.goto(BASE_URL);

    await page.getByRole('button', { name: 'M' }).click();
    const products = await page.locator('.sc-124al1g-2').count();

    expect(products).toBeGreaterThan(0);
  });

  // ------------------------------  
  // Test Case 7: Clear Size Filter  
  // ------------------------------
  test('Clear Size Filter', async ({ page }) => {
    await page.goto(BASE_URL);

    await page.getByRole('button', { name: 'XL' }).click();
    await page.getByRole('button', { name: 'XL' }).click(); // Unselect

    const products = await page.locator('.sc-124al1g-2').count();
    expect(products).toBeGreaterThan(0);
  });

  // ------------------------------  
  // Test Case 8: Verify Product Image Loads  
  // ------------------------------
  test('Verify Product Images Load', async ({ page }) => {
    await page.goto(BASE_URL);

    const images = page.locator('img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const isOk = await images.nth(i).evaluate(img => img.complete && img.naturalWidth > 0);
      expect(isOk).toBe(true);
    }
  });

  // ------------------------------  
  // Test Case 9: Verify Free Shipping Label  
  // ------------------------------
  test('Verify Free Shipping Label', async ({ page }) => {
    await page.goto(BASE_URL);

    const labels = await page.locator('text=Free shipping').count();
    expect(labels).toBeGreaterThan(0);
  });

  // ------------------------------  
  // Test Case 10: Responsive Cart Sidebar  
  // ------------------------------
  test('Responsive Cart Sidebar', async ({ page }) => {
    await page.goto(BASE_URL);

    await page.getByRole('button', { name: /add to cart/i }).first().click();
    await expect(page.locator('.sc-1h98xa9-0')).toBeVisible();

    await page.setViewportSize({ width: 375, height: 800 });
    await expect(page.locator('.sc-1h98xa9-0')).toBeVisible();
  });

});
