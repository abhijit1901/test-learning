require('dotenv').config();

module.exports = {
  // DEVELOPMENT: Uses your main .env file
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: './migrations'
    },
    // Good for debugging SQL queries
    debug: false 
  },

  // TEST: Uses a separate internal variable or fallback
  // This prevents accidental deletion of your dev data
  test: {
    client: 'pg',
    connection: process.env.TEST_DATABASE_URL || 'postgres://postgres:postgres@localhost:5433/test_db',
    migrations: {
      directory: './migrations'
    }
  },

  // PRODUCTION: Enforce SSL and pool limits
  production: {
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false } // Required for Heroku/Render/AWS
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './migrations'
    }
  }
};