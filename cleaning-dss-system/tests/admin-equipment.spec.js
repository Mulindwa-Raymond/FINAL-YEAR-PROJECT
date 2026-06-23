import { test, expect } from '@playwright/test';

test.describe('Admin Equipment Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/login');
    await page.getByLabel('Email').fill('admin@cleanmatch.com');
    await page.getByLabel('Password').fill('admin123');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(/\/admin\/dashboard/);
  });

  test('view equipment list', async ({ page }) => {
    await page.goto('/admin/equipment');
    
    // Should show equipment list
    await expect(page.getByText('Equipment')).toBeVisible();
    await expect(page.locator('table')).toBeVisible();
  });

  test('filter equipment by category', async ({ page }) => {
    await page.goto('/admin/equipment');
    
    // Select category filter
    await page.getByLabel('Category').selectOption('Floor Scrubbers');
    
    // Should filter results
    await expect(page.locator('table tbody tr')).toHaveCount(0); // or specific count
  });

  test('create new equipment', async ({ page }) => {
    await page.goto('/admin/equipment');
    
    // Click add button
    await page.getByRole('button', { name: /Add Equipment|Create/ }).click();
    
    // Fill form
    await page.getByLabel('Equipment Name').fill('Test Equipment');
    await page.getByLabel('Category').selectOption('Floor Scrubbers');
    await page.getByLabel('Brand').fill('Test Brand');
    await page.getByLabel('Price').fill('5000000');
    
    // Submit
    await page.getByRole('button', { name: 'Save Equipment' }).click();
    
    // Should show success
    await expect(page.getByText(/successfully|created/)).toBeVisible();
  });

  test('upload equipment image', async ({ page }) => {
    await page.goto('/admin/equipment');
    
    // Click edit on first equipment
    await page.getByRole('button', { name: /Edit/ }).first().click();
    
    // Upload image
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('tests/fixtures/test-image.jpg');
    
    // Click upload
    await page.getByRole('button', { name: 'Upload' }).click();
    
    // Should show success
    await expect(page.getByText(/uploaded|success/)).toBeVisible();
  });
});
