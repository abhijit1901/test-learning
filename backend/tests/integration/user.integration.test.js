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

describe('User API Advanced CRUD', () => {
  it('should create a user', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ email: 'create@example.com', name: 'Create User' });

    expect(res.statusCode).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.email).toBe('create@example.com');
    expect(res.body.name).toBe('Create User');
  });

  it('should list users', async () => {
    await request(app)
      .post('/api/users')
      .send({ email: 'list@example.com', name: 'List User' });

    const res = await request(app).get('/api/users');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].email).toBe('list@example.com');
    expect(res.body[0].name).toBe('List User');
  });

  it('should fetch a single user by ID', async () => {
    const createRes = await request(app)
      .post('/api/users')
      .send({ email: 'get@example.com', name: 'Get User' });

    const res = await request(app).get(`/api/users/${createRes.body.id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(createRes.body.id);
    expect(res.body.name).toBe('Get User');
  });

  it('should update user name', async () => {
    const createRes = await request(app)
      .post('/api/users')
      .send({ email: 'update@example.com', name: 'Old Name' });

    const res = await request(app)
      .put(`/api/users/${createRes.body.id}`)
      .send({ name: 'Updated Name' });

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(createRes.body.id);
    expect(res.body.name).toBe('Updated Name');
  });

  it('should delete a user and return 404 on fetch after delete', async () => {
    const createRes = await request(app)
      .post('/api/users')
      .send({ email: 'delete@example.com', name: 'Delete User' });

    const deleteRes = await request(app).delete(`/api/users/${createRes.body.id}`);
    expect(deleteRes.statusCode).toBe(204);

    const fetchRes = await request(app).get(`/api/users/${createRes.body.id}`);
    expect(fetchRes.statusCode).toBe(404);
    expect(fetchRes.body.message).toBe('User not found');
  });
});
