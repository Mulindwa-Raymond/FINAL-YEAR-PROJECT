// backend/__tests__/integration/recommendation.test.js
const request = require('supertest');
const app = require('../../server');
const { createTestUser } = require('../helpers/authHelper');

let token;

beforeAll(async () => {
  const user = await createTestUser();
  token = user.token;
});

describe('Recommendation API Integration', () => {
  test('POST /recommend returns valid ranked results', async () => {
    const res = await request(app)
      .post('/api/v1/recommend')
      .set('Authorization', `Bearer ${token}`)
      .send({
        surfaceType: 'concrete',
        dirtType: 'red laterite soil',
        domain: 'industrial',
        powerStability: 'unstable',
        ecoRequired: true
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.recommendations.length).toBeGreaterThan(0);
    expect(res.body.data.recommendations[0]).toHaveProperty('tco_5year_ugx');
    expect(res.body.data.recommendations[0]).toHaveProperty('detergent');
  });
});