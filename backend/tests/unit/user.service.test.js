const UserService = require('../../src/services/user.service');

describe('UserService', () => {
  let repo;
  let service;

  beforeEach(() => {
    repo = {
      create: jest.fn(),
      findById: jest.fn()
    };
    service = new UserService(repo);
  });

  it('creates user', async () => {
    repo.create.mockResolvedValue({ id: '1' });

    const result = await service.createUser({
      email: 'a@test.com',
      name: 'A'
    });

    expect(result.id).toBe('1');
  });

  it('throws on invalid input', async () => {
    await expect(service.createUser({}))
      .rejects
      .toThrow('Invalid input');
  });
});
