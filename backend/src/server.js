require('dotenv').config();

const { createPool } = require('./config/db');
const { createApp } = require('./app');
const UserRepository = require('./repositories/user.repository');
const UserService = require('./services/user.service');

async function start() {
  const pool = createPool();

  const repo = new UserRepository(pool);
  const service = new UserService(repo);

  const app = createApp({ userService: service });

  app.listen(process.env.PORT, () =>
    console.log(`Server running on port ${process.env.PORT}`)
  );
}

start();
