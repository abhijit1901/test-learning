/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  // 1. Ensure the UUID extension exists (Safe for all Postgres versions)
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

  // 2. Create the table
  // We strictly do NOT use createTableIfNotExists
  // If the table exists, we WANT it to fail so we know our DB is dirty.
  return knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('email').unique().notNullable();
    table.string('name').notNullable();
    
    // created_at and updated_at, defaulting to NOW()
    table.timestamps(true, true); 
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('users');
};