const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');
const errorMiddleware = require('./middlewares/error.middleware');
const userRoutes = require('./routes/user.routes');

function createApp({ userService }) {
  const app = express();

  app.use(express.json());

  app.use('/api/users', userRoutes(userService));
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use(errorMiddleware);

  return app;
}

module.exports = { createApp };
