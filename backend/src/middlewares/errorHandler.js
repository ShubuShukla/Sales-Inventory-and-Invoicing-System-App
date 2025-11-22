module.exports = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    ok: false,
    message: err.message || 'Something went wrong',
  });
};
