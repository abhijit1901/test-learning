const request = require('supertest');
const { createApp } = require('../../src/app');
const UserService = require('../../src/services/user.service');
const UserRepository = require('../../src/repositories/user.repository');
const { setupIntegrationDb } = require('./helpers/test-db');

let app;
let db;

beforeAll(async () => {
  db = await setupIntegrationDb();

  const repository = new UserRepository(db.pool);
  const service = new UserService(repository);
  app = createApp({ userService: service });
});

afterEach(async () => {
  if (db) {
    await db.cleanup();
  }
});

afterAll(async () => {
  if (db) {
    await db.teardown();
  }
});

describe('Error Handling Middleware', () => {
  it('should return 404 for a non-existent user ID', async () => {
    const fakeId = '00000000-0000-0000-0000-000000000000';
    const res = await request(app).get(`/api/users/${fakeId}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('User not found');
  });

  it('should return 400 for invalid input (missing name)', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ email: 'test@test.com' });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Invalid input');
  });

  it('should return 400 for invalid input (missing email)', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ name: 'No Email' });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Invalid input');
  });
});
