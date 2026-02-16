const { Pool } = require('pg');

function createPool(connectionString) {
  return new Pool({
    connectionString: connectionString || process.env.DATABASE_URL
  });
}

module.exports = { createPool };
