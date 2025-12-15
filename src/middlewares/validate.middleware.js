module.exports = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.json({
      status: 102,
      message: error.details[0].message,
      data: null,
    });
  }
  next();
};
