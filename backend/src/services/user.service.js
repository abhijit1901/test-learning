class UserService {
  constructor(repo) {
    this.repo = repo;
  }

  async createUser(data) {
    if (!data.email || !data.name) {
      throw new Error('Invalid input');
    }

    return this.repo.create(data);
  }

  async getUser(id) {
    const user = await this.repo.findById(id);
    if (!user) throw new Error('User not found');
    return user;
  }

  async getUsers() {
    return this.repo.findAll();
  }

  async updateUser(id, data) {
    const updated = await this.repo.update(id, data);
    if (!updated) throw new Error('User not found');
    return updated;
  }

  async deleteUser(id) {
    await this.repo.delete(id);
  }
}

module.exports = UserService;
