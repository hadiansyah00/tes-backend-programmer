module.exports = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        status: 102,
        message: error.details[0].message,
        data: null,
      });
    }

    next();
  };
};
