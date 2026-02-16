module.exports = (service) => ({
  create: async (req, res, next) => {
    try {
      const user = await service.createUser(req.body);
      res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  },

  getAll: async (req, res, next) => {
    try {
      const users = await service.getUsers();
      res.json(users);
    } catch (err) {
      next(err);
    }
  },

  getById: async (req, res, next) => {
    try {
      const user = await service.getUser(req.params.id);
      res.json(user);
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      const user = await service.updateUser(req.params.id, req.body);
      res.json(user);
    } catch (err) {
      next(err);
    }
  },

  delete: async (req, res, next) => {
    try {
      await service.deleteUser(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
});
