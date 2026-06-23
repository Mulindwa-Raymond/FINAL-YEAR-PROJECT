import { test, expect } from '@playwright/test';

test.describe('Admin Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('admin login with valid credentials', async ({ page }) => {
    // Fill in login form
    await page.getByLabel('Email').fill('admin@cleanmatch.com');
    await page.getByLabel('Password').fill('admin123');
    
    // Click login button
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Should redirect to admin dashboard
    await expect(page).toHaveURL(/\/admin\/dashboard/);
    await expect(page.getByText('Admin Dashboard')).toBeVisible();
  });

  test('admin login with invalid credentials shows error', async ({ page }) => {
    await page.getByLabel('Email').fill('admin@cleanmatch.com');
    await page.getByLabel('Password').fill('wrongpassword');
    
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Should show error message
    await expect(page.getByText(/Invalid credentials|Login failed/)).toBeVisible();
  });

  test('admin logout redirects to login', async ({ page }) => {
    // Login first
    await page.getByLabel('Email').fill('admin@cleanmatch.com');
    await page.getByLabel('Password').fill('admin123');
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Wait for dashboard
    await expect(page).toHaveURL(/\/admin\/dashboard/);
    
    // Logout
    await page.getByRole('button', { name: /Logout|Sign Out/ }).click();
    
    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);
  });

  test('protected admin routes redirect to login when not authenticated', async ({ page }) => {
    // Try to access admin dashboard without login
    await page.goto('/admin/dashboard');
    
    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);
  });
});
