import { test, expect } from '@playwright/test';

test.describe('API Health and Endpoints', () => {
  const API_BASE = 'http://localhost:5001/api/v1';

  test('health check endpoint returns 200', async ({ request }) => {
    const response = await request.get('http://localhost:5001/health');
    expect(response.status()).toBe(200);
    
    const body = await response.json();
    expect(body).toHaveProperty('status', 'OK');
    expect(body).toHaveProperty('message');
  });

  test('root endpoint returns API info', async ({ request }) => {
    const response = await request.get('http://localhost:5001/');
    expect(response.status()).toBe(200);
    
    const body = await response.json();
    expect(body).toHaveProperty('message');
    expect(body).toHaveProperty('version');
    expect(body).toHaveProperty('endpoints');
  });

  test('get all detergents endpoint', async ({ request }) => {
    const response = await request.get(`${API_BASE}/detergents`);
    expect(response.status()).toBe(200);
    
    const body = await response.json();
    expect(body).toHaveProperty('success', true);
    expect(body.data).toHaveProperty('detergents');
    expect(Array.isArray(body.data.detergents)).toBe(true);
  });

  test('get all equipment endpoint', async ({ request }) => {
    const response = await request.get(`${API_BASE}/equipment`);
    expect(response.status()).toBe(200);
    
    const body = await response.json();
    expect(body).toHaveProperty('success', true);
    expect(body.data).toHaveProperty('equipment');
    expect(Array.isArray(body.data.equipment)).toBe(true);
  });

  test('unauthenticated admin request returns 401', async ({ request }) => {
    const response = await request.post(`${API_BASE}/detergents`, {
      data: { product_name: 'Test' }
    });
    expect(response.status()).toBe(401);
  });

  test('protected endpoint without token returns 401', async ({ request }) => {
    const response = await request.get(`${API_BASE}/admin/dashboard`);
    expect(response.status()).toBe(401);
  });
});
