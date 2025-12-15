exports.success = (message, data = null) => ({
  status: 0,
  message,
  data,
});

exports.error = (status, message) => ({
  status,
  message,
  data: null,
});
