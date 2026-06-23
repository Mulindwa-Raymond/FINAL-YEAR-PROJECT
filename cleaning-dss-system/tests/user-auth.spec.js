import { test, expect } from '@playwright/test';

test.describe('User Authentication', () => {
  test('user registration with valid data', async ({ page }) => {
    await page.goto('/signup');
    
    // Fill registration form
    await page.getByLabel('Name').fill('Test User');
    await page.getByLabel('Email').fill(`test${Date.now()}@example.com`);
    await page.getByLabel('Password').fill('password123');
    await page.getByLabel('Confirm Password').fill('password123');
    
    // Submit
    await page.getByRole('button', { name: /Sign Up|Register/ }).click();
    
    // Should show success or redirect
    await expect(page.getByText(/success|registered|welcome/i)).toBeVisible();
  });

  test('user registration with mismatched passwords shows error', async ({ page }) => {
    await page.goto('/signup');
    
    await page.getByLabel('Name').fill('Test User');
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByLabel('Confirm Password').fill('different123');
    
    await page.getByRole('button', { name: /Sign Up|Register/ }).click();
    
    // Should show error
    await expect(page.getByText(/passwords do not match|must match/i)).toBeVisible();
  });

  test('user login with valid credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('password123');
    
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Should redirect to home or dashboard
    await expect(page).toHaveURL(/\/(home|dashboard|selector)/);
  });

  test('user login with invalid credentials shows error', async ({ page }) => {
    await page.goto('/login');
    
    await page.getByLabel('Email').fill('nonexistent@example.com');
    await page.getByLabel('Password').fill('wrongpassword');
    
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Should show error
    await expect(page.getByText(/invalid|not found|failed/i)).toBeVisible();
  });

  test('password reset flow', async ({ page }) => {
    await page.goto('/login');
    
    // Click forgot password
    await page.getByRole('link', { name: /forgot password/i }).click();
    
    // Should show reset form
    await expect(page.getByLabel('Email')).toBeVisible();
    
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByRole('button', { name: /send|reset/i }).click();
    
    // Should show success message
    await expect(page.getByText(/email sent|check your email/i)).toBeVisible();
  });
});
