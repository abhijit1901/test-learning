const express = require('express');
const controllerFactory = require('../controllers/user.controller');

module.exports = (service) => {
  const router = express.Router();
  const controller = controllerFactory(service);

  // NO SWAGGER COMMENTS HERE. 
  // We moved them to src/docs/swagger.js to prevent indentation errors.

  router.post('/', controller.create);
  router.get('/', controller.getAll);
  router.get('/:id', controller.getById);
  router.put('/:id', controller.update);
  router.delete('/:id', controller.delete);

  return router;
};