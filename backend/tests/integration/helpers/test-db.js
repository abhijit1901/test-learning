const path = require('path');
const knex = require('knex');
const { PostgreSqlContainer } = require('@testcontainers/postgresql');

const { createPool } = require('../../../src/config/db');

async function setupIntegrationDb() {
  const container = await new PostgreSqlContainer('postgres:16-alpine').start();
  const connectionString = container.getConnectionUri();

  const migrationClient = knex({
    client: 'pg',
    connection: connectionString,
    migrations: {
      directory: path.resolve(__dirname, '../../../migrations')
    }
  });

  await migrationClient.migrate.latest();
  await migrationClient.destroy();

  const pool = createPool(connectionString);

  async function cleanup() {
    await pool.query('TRUNCATE TABLE users RESTART IDENTITY CASCADE');
  }

  async function teardown() {
    await pool.end();
    await container.stop();
  }

  return {
    pool,
    cleanup,
    teardown
  };
}

module.exports = {
  setupIntegrationDb
};
