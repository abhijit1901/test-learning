module.exports = (err, req, res, next) => {
  if (err.message === 'User not found') {
    return res.status(404).json({ message: err.message });
  }

  if (err.message === 'Invalid input') {
    return res.status(400).json({ message: err.message });
  }

  res.status(500).json({ message: 'Internal Server Error' });
};
