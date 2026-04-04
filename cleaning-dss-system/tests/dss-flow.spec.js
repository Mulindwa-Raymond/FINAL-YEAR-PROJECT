import { test, expect } from '@playwright/test';

test('core dss flow works', async ({ page }) => {
  // 1. Go to home page
  await page.goto('/');
  await expect(page).toHaveTitle(/CleanMatch DSS/);
  await expect(page.getByText('Smart Cleaning Decisions for Ugandan Businesses')).toBeVisible();

  // 2. Click "Try the Selector"
  await page.getByRole('link', { name: 'Try the Selector' }).click();
  await expect(page).toHaveURL(/\/selector/);

  // 3. Step 1: Describe Task
  await expect(page.getByText('Step 1: Describe the Cleaning Task')).toBeVisible();
  await page.getByRole('combobox').selectOption('Tile');
  await page.getByRole('button', { name: 'Dust' }).click();
  await page.getByRole('button', { name: 'Next' }).click();

  // 4. Step 2: Operational Constraints
  await expect(page.getByText('Step 2: Specify Operational Constraints')).toBeVisible();
  await page.getByRole('button', { name: 'Next' }).click();

  // 5. Step 3: Chemical Preferences
  await expect(page.getByText('Step 3: Chemical Preferences')).toBeVisible();
  await page.getByRole('button', { name: 'Next' }).click();

  // 6. Step 4: Review
  await expect(page.getByText('Step 4: Review Your Selection')).toBeVisible();
  await page.getByRole('button', { name: 'Find Best Match' }).click();

  // 7. Results Page
  await expect(page).toHaveURL(/\/results/);
  
  // Wait for loading to finish
  await expect(page.getByText('Calculating total cost of ownership...')).toBeVisible();
  await expect(page.getByText('Calculating total cost of ownership...')).not.toBeVisible({ timeout: 15000 });

  await expect(page.getByText('Your Best Matches')).toBeVisible();
  
  // Wait for recommendations to load
  await expect(page.getByText('SuperScrub 2000')).toBeVisible();

  // 8. Detailed View
  await page.getByRole('button', { name: 'View Detailed Analysis' }).first().click();
  await expect(page).toHaveURL(/\/details/);
  await expect(page.getByText('TCO Breakdown (5-Year)')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'SuperScrub 2000' })).toBeVisible();
});
