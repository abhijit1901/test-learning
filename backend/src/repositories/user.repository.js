class UserRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async create(user) {
    const result = await this.pool.query(
      'INSERT INTO users(email, name) VALUES($1,$2) RETURNING *',
      [user.email, user.name]
    );
    return result.rows[0];
  }

  async findAll() {
    const result = await this.pool.query('SELECT * FROM users');
    return result.rows;
  }

  async findById(id) {
    const result = await this.pool.query(
      'SELECT * FROM users WHERE id=$1',
      [id]
    );
    return result.rows[0];
  }

  async update(id, user) {
    const result = await this.pool.query(
      'UPDATE users SET name=$1 WHERE id=$2 RETURNING *',
      [user.name, id]
    );
    return result.rows[0];
  }

  async delete(id) {
    await this.pool.query('DELETE FROM users WHERE id=$1', [id]);
  }
}

module.exports = UserRepository;
