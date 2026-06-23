import { test, expect } from '@playwright/test';

test.describe('Admin Detergent Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/login');
    await page.getByLabel('Email').fill('admin@cleanmatch.com');
    await page.getByLabel('Password').fill('admin123');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(/\/admin\/dashboard/);
  });

  test('view detergent list', async ({ page }) => {
    // Navigate to detergents
    await page.goto('/admin/detergents');
    
    // Should show detergent list
    await expect(page.getByText('Detergents')).toBeVisible();
    await expect(page.locator('table')).toBeVisible();
  });

  test('create new detergent', async ({ page }) => {
    await page.goto('/admin/detergents');
    
    // Click add button
    await page.getByRole('button', { name: /Add Detergent|Create/ }).click();
    
    // Fill form
    await page.getByLabel('Product Name').fill('Test Detergent');
    await page.getByLabel('Category').selectOption('Acid Cleaners');
    await page.getByLabel('pH Value').fill('7.0');
    await page.getByLabel('Unit Size').fill('5');
    
    // Submit
    await page.getByRole('button', { name: 'Save Detergent' }).click();
    
    // Should show success and redirect
    await expect(page.getByText(/successfully|created/)).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/detergents/);
  });

  test('edit existing detergent', async ({ page }) => {
    await page.goto('/admin/detergents');
    
    // Click edit on first detergent
    await page.getByRole('button', { name: /Edit/ }).first().click();
    
    // Modify a field
    await page.getByLabel('Product Name').fill('Updated Detergent Name');
    
    // Save
    await page.getByRole('button', { name: 'Save Detergent' }).click();
    
    // Should show success
    await expect(page.getByText(/successfully|updated/)).toBeVisible();
  });

  test('delete detergent with confirmation', async ({ page }) => {
    await page.goto('/admin/detergents');
    
    // Click delete on first detergent
    await page.getByRole('button', { name: /Delete/ }).first().click();
    
    // Confirm deletion
    await page.getByRole('button', { name: /Confirm|Delete/ }).click();
    
    // Should show success message
    await expect(page.getByText(/deleted|removed/)).toBeVisible();
  });
});
